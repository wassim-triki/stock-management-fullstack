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
}

export interface RegisterFormContextProps {
  registrationData: IRegisterData | null;
  updateRegistrationData: (property: Partial<IRegisterData>) => void;
}

// Initial state
const defaultState: RegisterFormContextProps = {
  registrationData: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateRegistrationData: () => {},
};

export const RegisterFormContext =
  createContext<RegisterFormContextProps>(defaultState);

interface UserFormProviderProps {
  children: React.ReactNode;
}
export const RegisterFormProvider: FC<UserFormProviderProps> = ({
  children,
}) => {
  const [registrationData, setRegistrationData] =
    useState<IRegisterData | null>(null);

  const updateRegistrationData = (values: Partial<IRegisterData>) => {
    setRegistrationData((prevData) => {
      if (prevData === null) {
        return { ...values } as IRegisterData;
      }
      return { ...prevData, ...values };
    });
  };

  useEffect(() => {
    console.log(registrationData);
  }, [registrationData]);

  return (
    <RegisterFormContext.Provider
      value={{ registrationData, updateRegistrationData }}
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
