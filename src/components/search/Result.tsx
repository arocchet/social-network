import React from "react";

// Define proper type definitions for your data
interface AccountItem {
  id: number;
  type: "accounts";
  username: string;
  displayName: string;
  image: string;
}

interface TagItem {
  id: number;
  type: "tags";
  name: string;
  postCount: number;
}

interface PlaceItem {
  id: number;
  type: "places";
  name: string;
  placeType: string;
}

type SearchItem = AccountItem | TagItem | PlaceItem;

// Define props interface
interface FakeResultsListProps {
  query: string;
  type?: string;
}

const FakeResultsList: React.FC<FakeResultsListProps> = ({
  query,
  type = "all",
}) => {
  // Sample data with proper typing
  const fakeData: SearchItem[] = [
    {
      id: 1,
      type: "accounts",
      username: "user1",
      displayName: "User One",
      image: "profile1.jpg",
    },
    {
      id: 2,
      type: "accounts",
      username: "user2",
      displayName: "User Two",
      image: "profile2.jpg",
    },
    { id: 3, type: "tags", name: "trending", postCount: 1234 },
    { id: 4, type: "places", name: "Paris, France", placeType: "City" },
    {
      id: 5,
      type: "accounts",
      username: "user3",
      displayName: "User Three",
      image: "profile3.jpg",
    },
    { id: 6, type: "tags", name: "photography", postCount: 5678 },
  ];

  // Type guards for safer type checking
  const isAccountItem = (item: SearchItem): item is AccountItem =>
    item.type === "accounts";

  const isTagItem = (item: SearchItem): item is TagItem => item.type === "tags";

  const isPlaceItem = (item: SearchItem): item is PlaceItem =>
    item.type === "places";

  // Filter results based on query and type
  const filteredResults = fakeData.filter((item) => {
    // First, filter by type if specified
    if (type !== "all" && item.type !== type) {
      return false;
    }

    // Then filter by search query
    if (isAccountItem(item)) {
      return (
        item.username.toLowerCase().includes(query.toLowerCase()) ||
        item.displayName.toLowerCase().includes(query.toLowerCase())
      );
    } else if (isTagItem(item) || isPlaceItem(item)) {
      return item.name.toLowerCase().includes(query.toLowerCase());
    }

    return false;
  });

  // If no results after filtering
  if (filteredResults.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[var(--textMinimal)]">
          Aucun résultat pour "{query}" {type !== "all" ? `dans ${type}` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredResults.map((item) => {
        if (isAccountItem(item)) {
          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 hover:bg-[var(--bgLevel2)] rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  {item.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm text-[var(--textNeutral)]">
                    {item.username}
                  </p>
                  <p className="text-xs text-[var(--textMinimal)]">
                    {item.displayName}
                  </p>
                </div>
              </div>
              <button className="text-sm font-medium text-[var(--blue)]"></button>
            </div>
          );
        } else if (isTagItem(item)) {
          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 hover:bg-[var(--bgLevel2)] rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[var(--bgLevel2)] flex items-center justify-center">
                  <span className="text-lg text-[var(--textNeutral)]">#</span>
                </div>
                <div>
                  <p className="font-medium text-sm text-[var(--textNeutral)]">
                    #{item.name}
                  </p>
                  <p className="text-xs text-[var(--textMinimal)]">
                    {item.postCount.toLocaleString()} posts
                  </p>
                </div>
              </div>
            </div>
          );
        } else if (isPlaceItem(item)) {
          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 hover:bg-[var(--bgLevel2)] rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[var(--bgLevel2)] flex items-center justify-center">
                  <span className="text-lg text-[var(--textNeutral)]">📍</span>
                </div>
                <div>
                  <p className="font-medium text-sm text-[var(--textNeutral)]">
                    {item.name}
                  </p>
                  <p className="text-xs text-[var(--textMinimal)]">
                    {item.placeType}
                  </p>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default FakeResultsList;
