import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const isUserLoggedIn = false;

export default function Index() {
  return (
    // navbar
    <>
      <nav className="flex justify-between items-center p-4 bg-stone-50 px-8">
        <div className="flex gap-8 items-center">
          <img
            src="/dnd-logo-blk.png"
            alt="DnD Wiki"
            className="w-10 h-10 object-cover"
          ></img>
          <h1 className="text-4xl font-bod">The Realm Record</h1>
        </div>
        <ul className="flex space-x-4">
          {isUserLoggedIn ? (
            <>
              <li>
                <a href="/spells">Spells</a>
              </li>
              <li>
                <a href="/monsters">Monsters</a>
              </li>
              <li>
                <a href="/items">Items</a>
              </li>
              <li>
                <a href="/logout">Logout</a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/login">Login</a>
              </li>
            </>
          )}
        </ul>
        {/* hero component */}
      </nav>
      <div className="container mx-auto p-4 text-black my-11 rounded-lg bg-stone-200/75 min-h-80 flex justify-between">
        <div className="flex flex-col justify-center w-2/3 p-8">
          <h2 className="text-2xl font-bold">Discover the World of Faerun!</h2>
          <p className="text-lg">
            Dive into a rich archive of lore, characters, and ongoing quests
            from our latest campaign. Here, you’ll find everything you need to
            navigate the lands, track key players, and stay informed on current
            missions. Whether you’re preparing for the next session or
            revisiting past encounters, this is your portal to the adventure.
          </p>
        </div>
        <img
          src="/DND_Art9.png"
          alt="Dungeons and Dragons"
          className="rounded-lg object-cover w-1/3"
        ></img>
      </div>
    </>
  );
}
