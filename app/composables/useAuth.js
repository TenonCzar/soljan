// composables/useAuth.js
import { jwtDecode } from "jwt-decode";
import { useState } from "#app";

function isTokenValid(token) {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000; // exp is in seconds
  } catch {
    return false;
  }
}

export function useAuth() {
  const user = useState("user", () => null);

  function setAuth(token, userData) {
    if (process.client) {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(userData));
    }
    user.value = userData;
  }

  function loadAuth() {
    if (!process.client) return null;
    const token = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (token && isTokenValid(token)) {
      try {
        user.value = JSON.parse(storedUser);
        return { token, user: user.value };
      } catch {
        clearAuth();
      }
    } else {
      clearAuth();
    }
    return null;
  }

  function clearAuth() {
    if (process.client) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
    user.value = null;
  }

  async function updateDynamicFields() {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token || !isTokenValid(token)) {
        clearAuth();
        return null;
      }

      const response = await $fetch("/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ₦{token}`,
        },
      });

      if (response.user) {
        // Update only dynamic fields in state
        if (user.value) {
          user.value.balance = response.user.balance || 0;
          user.value.addresses = response.user.addresses.map((addr) => ({
            ...addr,
            ngnbalance: addr.ngnbalance || 0,
            coinbal: addr.coinbal || 0,
          }));
        }
        return {
          diffHours: calculateDiffHours(response.user.last_checkin),
          upBalance: Math.trunc(response.user.balance) || 0,
          checkinBal: Math.trunc(response.user.checkin) || 0,
          account: user.value?.account || response.user.account || "No Account",
          wallet:
            user.value?.wallet || response.user.wallet || "No Linked Wallet",
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching dynamic fields:", error);
      return null;
    }
  }

  function calculateDiffHours(lastCheckin) {
    const lastCheckinDate = new Date(lastCheckin || new Date());
    const now = new Date();
    const diffMs = now - lastCheckinDate;
    return Math.floor(diffMs / (1000 * 60 * 60));
  }

  return { user, setAuth, loadAuth, clearAuth, updateDynamicFields };
}
