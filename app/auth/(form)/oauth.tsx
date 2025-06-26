"use client";

import { useState, useEffect } from "react";
import { getProviders } from "next-auth/react";
import { type BuiltInProviderType } from "next-auth/providers/index";
import { signIn, type ClientSafeProvider, type LiteralUnion } from "next-auth/react";

type Provider = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;

export default function OAuth() {
  const [providers, setProviders] = useState<Provider | null>(null);

  useEffect(() => {
    getProviders().then(data => setProviders(data));
  }, []);

  if (providers === null || Object.keys(providers).length === 0) return null;

  return (
    <>
      <div className="flex flex-row align-middle justify-between select-none my-8">
        <hr
          className="flex-1 text-overlay0 border-1"
          style={{
            transform: "translateY(10px)",
          }}
        />
        <span className="text-md mx-2">OR</span>
        <hr
          className="flex-1 text-overlay0 border-1"
          style={{
            transform: "translateY(10px)",
          }}
        />
      </div>
      <div className="flex flex-col gap-3">
        {
          Object.values(providers ?? {}).filter(({ name }) => name !== "Credentials" ).map((provider) => (
            <button
              key={provider.id}
              onClick={() => signIn(provider.id, { callbackUrl: "/drive" })}
              className="text-md bg-base border-1 border-surface0 rounded-sm py-2 hover:border-mauve hover:text-mauve hover:bg-base/50"
            >Sign up with { provider.name }</button>
          ))
        }
      </div>
    </>
  );
}