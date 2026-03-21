import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ACCESS_TOKEN_COOKIE_NAME } from "../constants";
import { createAccessToken } from "../helpers";
import { LoginFormValues, loginSchema } from "../validation/loginSchema";

export const useLoginSubmit = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    try {
      clearErrors("root");

      const accessToken = createAccessToken();

      Cookies.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        expires: 7,
        path: "/",
        sameSite: "lax",
        secure: window.location.protocol === "https:",
      });

      router.replace("/");
    } catch {
      setError("root", {
        type: "server",
        message: "Unable to create a login session. Please try again.",
      });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    showPassword,
    setShowPassword,
    onSubmit,
  };
};
