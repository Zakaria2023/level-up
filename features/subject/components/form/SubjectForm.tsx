"use client";

import FormError from "@/components/feedback/FormError";
import ServerError from "@/components/feedback/ServerError";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { useSubjectForm } from "../../hooks/useSubjectForm";

type SubjectFormProps = {
  mode?: "create" | "edit";
  rowId?: number;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelHref?: string;
};

export const SubjectForm = ({
  mode = "create",
  rowId,
  title,
  subtitle,
  submitLabel,
  cancelHref,
}: SubjectFormProps = {}) => {
  const {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    serverError,
    onSubmit,
    resetForm,
    existingRow,
    subjectType,
    setSubjectType,
    subjectTypeOptions,
    teacherIds,
    setTeacherIds,
    teacherOptions,
    schoolClassOptions,
    hasSchoolClassOptions,
    classSettingFields,
    setClassSettingSchoolClassId,
    addClassSetting,
    removeClassSetting,
    gradeBreakdownFields,
    gradeBreakdownValues,
    addGradeBreakdown,
    removeGradeBreakdown,
  } = useSubjectForm({
    mode,
    rowId,
  });

  const resolvedTitle =
    title ?? (mode === "edit" ? "Edit Subject" : "Add Subject");
  const resolvedSubtitle =
    subtitle ??
    (mode === "edit"
      ? "Update the selected subject record."
      : "Create a new subject record and add it to the table.");
  const resolvedSubmitLabel =
    submitLabel ?? (mode === "edit" ? "Save Changes" : "Save");
  const resolvedCancelHref =
    cancelHref ?? (mode === "edit" && rowId ? `/subject-configuration/${rowId}` : "/subject-configuration");
  const inputsDisabled = isSubmitting || !hasSchoolClassOptions;
  const gradeBreakdownTotal = gradeBreakdownValues.reduce(
    (total, item) => total + (item?.percentage ?? 0),
    0,
  );
  const gradeBreakdownError =
    typeof errors.gradeBreakdown?.message === "string"
      ? errors.gradeBreakdown.message
      : undefined;

  if (mode === "edit" && !existingRow) {
    return (
      <DashboardCard
        title="Subject Not Found"
        subtitle="The requested record could not be loaded for editing."
        className="max-w-120"
      >
        <div className="flex justify-end">
          <Link
            href="/subject-configuration"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            Back to Table
          </Link>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title={resolvedTitle}
      subtitle={resolvedSubtitle}
      className="max-w-240"
      contentClassName="px-4 pb-4 pt-4 md:px-5"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Subject Name"
            requiredMark
            inputType="text"
            placeholder="Mathematics"
            error={errors.subjectName?.message}
            disabled={inputsDisabled}
            {...register("subjectName")}
          />

          <Controller
            control={control}
            name="subjectType"
            render={() => (
              <Dropdown
                label="Subject Type"
                value={subjectType || undefined}
                onChange={setSubjectType}
                options={subjectTypeOptions}
                placeholder="Select subject type"
                error={errors.subjectType?.message}
                disabled={inputsDisabled}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="teacherIds"
          render={() => (
            <MultiSelectDropdown
              label="Teachers"
              values={teacherIds}
              onChange={setTeacherIds}
              options={teacherOptions}
              placeholder="Select teachers"
              searchable
              searchPlaceholder="Search teachers"
              error={errors.teacherIds?.message}
              disabled={isSubmitting}
            />
          )}
        />

        <div className="rounded-3xl border border-(--border-color) bg-[#F8FDFF] p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-[16px] font-semibold text-[#0D3B52]">
                School Class Settings
              </h3>
              <p className="text-sm text-[#97A6B6]">
                Link the subject to one or more classes, then define the weekly
                periods and period duration.
              </p>
            </div>

            <button
              type="button"
              onClick={addClassSetting}
              disabled={inputsDisabled}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong) transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Add Class Setting
            </button>
          </div>

          {!hasSchoolClassOptions ? (
            <div className="rounded-[20px] border border-(--border-color) bg-white px-4 py-3 text-sm font-medium text-(--muted-text)">
              Add a school class first so you can link this subject to
              classes.
            </div>
          ) : null}

          <div className="space-y-4">
            {classSettingFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-[20px] border border-(--border-color) bg-white p-4"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-[#0D3B52]">
                    Class Setting {index + 1}
                  </h4>
                  {classSettingFields.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeClassSetting(index)}
                      disabled={isSubmitting}
                      className="text-sm font-semibold text-[#C25353] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Controller
                    control={control}
                    name={`classSettings.${index}.schoolClassId`}
                    render={({ field: fieldControl }) => (
                      <Dropdown
                        label="School Class"
                        value={fieldControl.value || undefined}
                        onChange={(value) => {
                          fieldControl.onChange(value);
                          setClassSettingSchoolClassId(index, value);
                        }}
                        options={schoolClassOptions}
                        placeholder="Select school class"
                        searchable
                        searchPlaceholder="Search school class"
                        error={errors.classSettings?.[index]?.schoolClassId?.message}
                        disabled={inputsDisabled}
                      />
                    )}
                  />

                  <Input
                    label="Weekly Periods Count"
                    requiredMark
                    inputType="number"
                    placeholder="5"
                    min={1}
                    max={20}
                    error={errors.classSettings?.[index]?.weeklyPeriodsCount?.message}
                    disabled={inputsDisabled}
                    {...register(`classSettings.${index}.weeklyPeriodsCount` as const, {
                      valueAsNumber: true,
                    })}
                  />

                  <Input
                    label="Period Duration (Minutes)"
                    requiredMark
                    inputType="number"
                    placeholder="45"
                    min={1}
                    max={180}
                    error={errors.classSettings?.[index]?.periodDurationMinutes?.message}
                    disabled={inputsDisabled}
                    {...register(`classSettings.${index}.periodDurationMinutes` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-(--border-color) bg-[#F8FDFF] p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-[16px] font-semibold text-[#0D3B52]">
                Grade Breakdown
              </h3>
              <p className="text-sm text-[#97A6B6]">
                Split the subject grade into named activities. The total must equal
                100%.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
                Total: {gradeBreakdownTotal}%
              </div>
              <button
                type="button"
                onClick={addGradeBreakdown}
                disabled={isSubmitting}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong) transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Add Breakdown
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {gradeBreakdownFields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-[20px] border border-(--border-color) bg-white p-4"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-[#0D3B52]">
                    Activity {index + 1}
                  </h4>
                  {gradeBreakdownFields.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeGradeBreakdown(index)}
                      disabled={isSubmitting}
                      className="text-sm font-semibold text-[#C25353] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Activity Name"
                    requiredMark
                    inputType="text"
                    placeholder="Homework"
                    error={errors.gradeBreakdown?.[index]?.activityName?.message}
                    disabled={isSubmitting}
                    {...register(`gradeBreakdown.${index}.activityName` as const)}
                  />

                  <Input
                    label="Percentage"
                    requiredMark
                    inputType="number"
                    placeholder="20"
                    min={0}
                    max={100}
                    error={errors.gradeBreakdown?.[index]?.percentage?.message}
                    disabled={isSubmitting}
                    {...register(`gradeBreakdown.${index}.percentage` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            ))}
          </div>

          <FormError>{gradeBreakdownError}</FormError>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Minimum Passing Grade"
            requiredMark
            inputType="number"
            placeholder="50"
            min={0}
            max={100}
            error={errors.minimumPassingGrade?.message}
            disabled={isSubmitting}
            {...register("minimumPassingGrade", { valueAsNumber: true })}
          />

          <Input
            label="Teaching Language"
            requiredMark
            inputType="text"
            placeholder="English"
            error={errors.teachingLanguage?.message}
            disabled={isSubmitting}
            {...register("teachingLanguage")}
          />
        </div>

        <div>
          <p className="mb-3 text-[16px] font-semibold text-[#0E6B7A]">
            Subject Toggles
          </p>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("countsTowardAverage")}
              />
              Counts Toward Average
            </label>

            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("requiresLab")}
              />
              Requires Lab
            </label>

            <label className="inline-flex items-center gap-3 rounded-xl border border-[#B8C9D8] bg-white px-4 py-3 text-[15px] font-medium text-[#244E62]">
              <input
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 rounded border border-[#C7D6E2] accent-[#29B5C5]"
                {...register("hasQuestionBank")}
              />
              Has Question Bank
            </label>
          </div>
        </div>

        {serverError ? <ServerError>{serverError}</ServerError> : null}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-6 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3] disabled:cursor-not-allowed disabled:opacity-70"
          >
            Reset
          </button>

          <Link
            href={resolvedCancelHref}
            onClick={resetForm}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#F3F5F8] px-8 text-[16px] font-semibold text-[#6B7A8D] transition hover:bg-[#ECEFF3]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={inputsDisabled}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-6 text-[16px] font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : resolvedSubmitLabel}
          </button>
        </div>
      </form>
    </DashboardCard>
  );
};
