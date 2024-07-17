import React, {
  createContext,
  useState,
  ReactNode,
  FC,
  useContext,
} from "react";

export interface IRegisterData {
  email: string;
  password: string;
  confirmPassowrd: string;
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

  return (
    <RegisterFormContext.Provider
      value={{ registrationData, updateRegistrationData }}
    >
      {children}
    </RegisterFormContext.Provider>
  );
};

export const useUserFormContext = () => {
  const context = useContext(RegisterFormContext);
  if (!context) {
    throw new Error(
      "useUserFormContext must be used within a UserFormContextProvider",
    );
  }
  return context;
};
