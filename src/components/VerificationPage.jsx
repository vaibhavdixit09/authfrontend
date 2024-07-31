import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerificationPage = () => {
  const [status, setStatus] = useState("Verifying...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const query = new URLSearchParams(location.search);
      const token = query.get("token");

      if (!token) {
        setStatus("No token provided");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:4000/api/v1/verify-email?token=${token}`
        );

        if (response.ok) {
          setStatus("Email verified successfully");
          setTimeout(() => {
            // Redirect user to login or home page after successful verification
            navigate("/employee-panel");
          }, 2000);
        } else {
          setStatus(
            "Verification failed. The token might be invalid or expired."
          );
        }
      } catch (error) {
        console.error("Error:", error);
        setStatus("An error occurred during verification.");
      }
    };

    verifyEmail();
  }, [location.search, navigate]);

  return (
    <div
      className="text-2xl font-bold text-green-600"
      style={{ textAlign: "center", marginTop: "20px" }}
    >
      <h1>{status}</h1>
    </div>
  );
};

export default VerificationPage;
