'use client';
import { register } from "@/lib/client/user/register";
import { RegisterUserFormData, UserSchemas } from "@/lib/schemas/user";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type ImageKey = "avatar" | "banner";
type ImageRefs = {
  avatar: React.RefObject<HTMLInputElement | null>;
  banner: React.RefObject<HTMLInputElement | null>;
}

type UserFormContextType = {
  userInfo: RegisterUserFormData;
  inputRefs: ImageRefs;
  errors: Partial<RegisterUserFormData>;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleThumbnailClick: (key: ImageKey) => void;
  handleFileChange: (key: ImageKey, e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemove: (key: ImageKey) => void;
};

const UserFormContext = createContext<UserFormContextType | undefined>(undefined);

export const UserFormProvider = ({ children }: { children: React.ReactNode }) => {

  const router = useRouter();

  const initialImageData = {
    previewUrl: null,
    fileName: null,
    file: null
  };

  const [userInfo, setUserInfo] = useState<RegisterUserFormData>({
    username: "",
    firstname: "",
    lastname: "",
    dateOfBirth: "",
    biography: "",
    password: "",
    email: "",
    avatar: initialImageData,
    banner: initialImageData,
  });

  const [errors, setErrors] = useState<Partial<RegisterUserFormData>>({});

  const inputRefs = {
    avatar: useRef<HTMLInputElement | null>(null),
    banner: useRef<HTMLInputElement | null>(null),
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [id]: value.trim(),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = UserSchemas.Auth.RegisterUserForm.safeParse(userInfo);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        biography: fieldErrors.biography?.[0],
        dateOfBirth: fieldErrors.dateOfBirth?.[0],
        firstname: fieldErrors.firstname?.[0],
        lastname: fieldErrors.lastname?.[0],
        username: fieldErrors.username?.[0],
      });
      return;
    }
    try {
      setErrors({});
      const response = await register(userInfo);
      console.log('response sucess', response)
      if (response.success) router.push('/')
    } catch (err) {
      if (err && typeof err === "object" && !Array.isArray(err)) {
        setErrors((prev) => ({ ...prev, ...err }));
      } else if (err instanceof Error) {
        console.error("Unexpected error :", err.message);
      }
    }
  };

  const handleFileChange = (
    key: ImageKey,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo((prev) => ({
          ...prev,
          [key]: {
            previewUrl: reader.result as string,
            fileName: file.name,
            file: file
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = useCallback((key: ImageKey) => {
    const preview = userInfo[key]?.previewUrl;
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setUserInfo((prev) => ({
      ...prev,
      [key]: {
        previewUrl: null,
        fileName: null,
      },
    }));

    const inputRef = inputRefs[key].current;
    if (inputRef) inputRef.value = "";
  }, [userInfo]);

  const handleThumbnailClick = (key: ImageKey) => {
    inputRefs[key].current?.click();
  };

  useEffect(() => {
    return () => {
      ["avatar", "cover"].forEach((key) => {
        const preview = userInfo[key as ImageKey]?.previewUrl;
        if (preview) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [userInfo]);

  return (
    <UserFormContext.Provider
      value={{
        userInfo,
        errors,
        inputRefs,
        handleChange,
        handleSubmit,
        handleThumbnailClick,
        handleFileChange,
        handleRemove,
      }}
    >
      {children}
    </UserFormContext.Provider>
  );
};

export const useUserForm = () => {
  const context = useContext(UserFormContext);
  if (!context) {
    throw new Error("useUserForm must be used within a UserFormProvider");
  }
  return context;
};