import React, {
  createContext,
  useState,
  ReactNode,
  FC,
  useContext,
  useEffect,
} from "react";

export interface IRegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface IRegisterFormStep {
  step: number;
  formData: IRegisterData | null;
}

export interface RegisterFormContextProps {
  step: number | null;
  formData: IRegisterData | null;
  nextStep: () => void;
  prevStep: () => void;
  initStep: () => void;
  updateRegistrationData: (property: Partial<IRegisterData>) => void;
}

// Initial state
const defaultState: RegisterFormContextProps = {
  step: null,
  formData: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateRegistrationData: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  prevStep: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  nextStep: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initStep: () => {},
};

export const RegisterFormContext =
  createContext<RegisterFormContextProps>(defaultState);

interface UserFormProviderProps {
  children: React.ReactNode;
}
export const RegisterFormProvider: FC<UserFormProviderProps> = ({
  children,
}) => {
  const [formData, setFormData] = useState<IRegisterData | null>(null);

  const [step, setStep] = useState<number>(1);

  const initStep = () => setStep(1);
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateRegistrationData = (values: Partial<IRegisterData>) => {
    setFormData((prevData) => {
      if (prevData === null) {
        return { ...values } as IRegisterData;
      }
      return { ...prevData, ...values };
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <RegisterFormContext.Provider
      value={{
        initStep,
        formData,
        step,
        nextStep,
        prevStep,
        updateRegistrationData,
      }}
    >
      {children}
    </RegisterFormContext.Provider>
  );
};

export const useRegisterFormContext = () => {
  const context = useContext(RegisterFormContext);
  if (!context) {
    throw new Error(
      "useRegisterFormContext must be used within a RegisterFormProvider",
    );
  }
  return context;
};
