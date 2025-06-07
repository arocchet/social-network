import { UserFormProvider } from "@/app/context/user-register-form-context";
import OnBoarding from "@/components/onboarding/OnBoarding";


interface UserInfoType {
  email?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  avatar?: string;
  googleId?: string;
  birthday?: string;
}

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const userInfo: UserInfoType = {
    email: "searchParams.email",
    firstname: undefined,
    lastname:undefined,
    username: "searchParams.username",
    avatar: 'https://images.pexels.com/photos/32315961/pexels-photo-32315961.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load',//"searchParams.avatar",
    googleId: "searchParams.googleId",
    birthday: "searchParams.birthday",
  };

  return (
     <UserFormProvider>
      <OnBoarding obj={userInfo} />
    </UserFormProvider>
  );
}
