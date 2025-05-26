import Image from "next/image";

interface FakeResultProps {
  avatar: string;
  username: string;
  fullname: string;
  followers: string;
}

export function FakeResult({
  avatar,
  username,
  fullname,
  followers,
}: FakeResultProps) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image src={avatar} alt={username} layout="fill" objectFit="cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">@{username}</p>
        <p className="text-xs text-gray-500 truncate">{fullname}</p>
      </div>
      <p className="text-xs text-gray-400 whitespace-nowrap">{followers}</p>
    </div>
  );
}

// Exemple d’utilisation :

const mockResults = [
  {
    avatar: "https://images.pexels.com/photos/40192/woman-happiness-sunrise-silhouette-40192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    username: "hellomoonshop",
    fullname: "Hello Moon Shop ® – ESHOP",
    followers: "330K followers",
  },
  {
    avatar: "https://images.pexels.com/photos/3992656/pexels-photo-3992656.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    username: "hello_caen",
    fullname: "Hello Caen",
    followers: "",
  },
  {
    avatar: "https://images.pexels.com/photos/573299/pexels-photo-573299.jpeg?auto=compress&cs=tinysrgb&w=600",
    username: "hello.is.fit__",
    fullname: "Hello is Fit 🧘‍♀️",
    followers: "118K followers",
  },
  // …etc.
];

export default function FakeResultsList() {
  return (
    <div className="w-full max-w-md mx-auto divide-y divide-gray-200">
      {mockResults.map((r) => (
        <FakeResult key={r.username} {...r} />
      ))}
    </div>
  );
}
