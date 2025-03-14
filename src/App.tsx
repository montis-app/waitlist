import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import React from "react";

const App: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [subscribed, setSubscribed] = React.useState<boolean>(false);
  const [verified, setVerified] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (window.location.hash === "#verified") {
      setVerified(true);
    }
    if (window.location.hash === "#error") {
      setError(true);
    }
    window.location.hash = "";
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center md:flex-row">
      <div className="flex w-full flex-col items-center justify-center gap-4 bg-gray-100 px-8 py-16 md:h-screen md:w-1/2 md:px-16">
        <h1 className="text-8xl font-black">MONTIS</h1>
        <p className="text-bold text-center text-2xl">
          Your AI-Powered Email client
          <br />
          that respects privacy.
        </p>
        <ul className="mt-8 w-full max-w-160 list-none pl-0 text-lg">
          {[
            {
              title: "reimagine Email with AI",
              description:
                'MONTIS is not just "another email client". It\'s an AI assistant that extracts informations from emails, converts them into tasks and organizes them for you.',
            },
            {
              title: "Local-First",
              description:
                "Your data stays on your device. No data is sent to external AI cloud providers - everything is processed on your machine.",
            },
            {
              title: "Transparent",
              description:
                "With sensitive information comes great responsibility - all the source code is publicly available so you always know where your data is stored and processed.",
            },
            {
              title: "Easy to get started",
              description:
                "No Setup Hassle - Just add your existing IMAP/SMTP account and you are good to go.",
            },
          ].map((item, i) => (
            <li className="mt-4 flex">
              <span className="w-10 flex-shrink-0 text-2xl font-bold text-gray-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl">{item.title}</h2>
                <p className="font-thin">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center gap-4 md:h-screen md:w-1/2">
        <div className="flex w-full max-w-md flex-col gap-16 px-8 pt-16 pb-32 md:pb-16">
          <p className="text-center text-5xl font-thin">
            Join the waitlist
            <br />
            to be the first to know when we launch!
          </p>
          <div className="flex flex-col gap-8">
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                setLoading(true);
                setError(false);
                setVerified(false);
                setSubscribed(false);
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                fetch("/api/submit.php", {
                  method: "POST",
                  body: formData,
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.error) {
                      console.error(data.error);
                      setError(true);
                    } else {
                      setSubscribed(true);
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                    setError(true);
                  })
                  .finally(() => setLoading(false));
              }}
            >
              <label className="flex flex-col gap-2">
                <span className="pl-4 text-lg text-gray-500">Your Email</span>
                <input
                  className="w-full rounded-full border border-gray-400 bg-white px-4 py-2 text-lg focus:ring-2 focus:ring-emerald-900 focus:outline-none"
                  type="email"
                  name="email"
                  placeholder="hello@montis.app"
                  required
                />
              </label>
              <button
                disabled={loading}
                type="submit"
                className="flex w-full cursor-pointer items-center gap-4 rounded-full border border-emerald-700 bg-emerald-700 px-4 py-2 text-center text-lg text-white hover:bg-emerald-800 focus:ring-2 focus:ring-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex w-full justify-center">
                  Join the waitlist
                </span>
                <PaperAirplaneIcon className="size-4" />
              </button>
            </form>
            {error ? (
              <p className="rounded-lg border-1 border-red-800 bg-red-50 p-2 p-4 text-center text-red-800">
                There was an error. Please try again or contact us.
              </p>
            ) : subscribed ? (
              <p className="rounded-lg border-1 border-green-800 bg-green-50 p-2 p-4 text-center text-green-800">
                Thank you for subscribing! You will receive an email shortly to
                verify your email.
              </p>
            ) : verified ? (
              <p className="rounded-lg border-1 border-green-800 bg-green-50 p-2 p-4 text-center text-green-800">
                Thank you for verifying your email! You are now on the waitlist.
              </p>
            ) : null}
          </div>
        </div>

        <p className="absolute bottom-2 w-full p-4 text-center text-gray-500 md:text-xs">
          MONTIS is a project by{" "}
          <a target="_blank" href="https://nico.dev">
            Nico Martin / sandkopf GmbH
          </a>
        </p>
      </div>
    </div>
  );
};

export default App;
