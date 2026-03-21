"use client";

import Input from "@/components/ui/Input";
import Image from "next/image";
import { useState } from "react";
import { FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";


export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="w-full max-w-110 rounded-[28px] border border-[#EDF4FA] bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)] sm:p-8">
      <div>
        <div className="flex justify-center">
          <Image
            src="/logo.webp"
            alt="Level Up logo"
            width={120}
            height={86}
            className="object-contain"
            priority
          />
        </div>

        <div className="text-left">
          <h1 className="text-[34px] font-semibold tracking-[-0.03em] text-[#0D3B52]">
            Login
          </h1>
        </div>

        <form className="mt-4 space-y-5">
          <Input
            id="email"
            label="Email"
            inputType="email"
            autoComplete="email"
            placeholder="Enter your email"
          />

          <Input
            id="password"
            label="Password"
            inputType={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            rightSide={
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                className="text-[#7C93A8] transition hover:text-[#29B5C5]"
              >
                {showPassword ? (
                  <FiEyeOff className="text-[18px]" />
                ) : (
                  <FiEye className="text-[18px]" />
                )}
              </button>
            }
          />

          <button
            type="submit"
            className="group flex h-11 w-full items-center justify-center gap-3 rounded-xl bg-[#29B5C5] px-6 text-[16px] font-semibold text-white shadow-[0_14px_26px_rgba(31,165,227,0.18)] transition hover:bg-[#1497D4] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span>Sign in to dashboard</span>
            <FiArrowRight className="text-[18px] transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </section>
  );
};
