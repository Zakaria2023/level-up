"use client";

import ServerError from "@/components/feedback/ServerError";
import Input from "@/components/ui/Input";
import useCurrentLang from "@/hooks/useCurrentLang";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { useLoginSubmit } from "../../hooks/useLoginSubmit";

export const LoginForm = () => {
  const { t } = useTranslation();
  const lang = useCurrentLang()

  const {
    errors,
    handleSubmit,
    isSubmitting,
    onSubmit,
    register,
    setShowPassword,
    showPassword,
  } = useLoginSubmit();

  return (
    <section className="w-full max-w-110 rounded-[28px] border border-[#EDF4FA] bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)] sm:p-8">
      <div>
        <div className="flex justify-center">
          <Image
            src="/logo.webp"
            alt={t("LoginForm.logoAlt")}
            width={120}
            height={86}
            className="object-contain"
            unoptimized
            priority
          />
        </div>

        <div>
          <h1 className="text-[34px] font-semibold tracking-[-0.03em] text-[#0D3B52]">
            {t("LoginForm.title")}
          </h1>
        </div>

        <form
          className="mt-4 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Input
            id="email"
            label={t("LoginForm.emailLabel")}
            requiredMark
            inputType="email"
            autoComplete="email"
            placeholder={t("LoginForm.emailPlaceholder")}
            error={errors.email?.message}
            disabled={isSubmitting}
            {...register("email")}
          />

          <Input
            id="password"
            label={t("LoginForm.passwordLabel")}
            requiredMark
            inputType={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder={t("LoginForm.passwordPlaceholder")}
            error={errors.password?.message}
            disabled={isSubmitting}
            {...register("password")}
            rightSide={
              <button
                type="button"
                aria-label={
                  showPassword
                    ? t("LoginForm.hidePassword")
                    : t("LoginForm.showPassword")
                }
                onClick={() => setShowPassword((current) => !current)}
                disabled={isSubmitting}
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

          {errors.root?.message ? (
            <ServerError>{errors.root.message}</ServerError>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex h-11 w-full items-center justify-center gap-3 rounded-xl bg-[#29B5C5] px-6 text-[16px] font-semibold text-white shadow-[0_14px_26px_rgba(31,165,227,0.18)] transition hover:bg-[#1497D4] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span>
              {isSubmitting
                ? t("LoginForm.signingIn")
                : t("LoginForm.signInToDashboard")}
            </span>
            {lang === 'ar' ? <FiArrowLeft className="text-[18px] transition-transform duration-200 group-hover:translate-x-1" /> : <FiArrowRight className="text-[18px] transition-transform duration-200 group-hover:translate-x-1" />}
          </button>
        </form>
      </div>
    </section>
  );
};