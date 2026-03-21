import { PropsWithChildren } from "react";

const FormError = ({ children }: PropsWithChildren) => {
  if (children)
    return (
      <p className="text-red-500 border-t border-red-500 mt-2">{children}</p>
    );
};

export default FormError;
