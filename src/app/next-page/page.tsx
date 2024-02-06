"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import liff from "@line/liff";
require("dotenv").config();
import { Flex, Spin, Button, message } from "antd";
import axios from "axios";

const LIFF_ID = process.env.LIFF_ID || "2003144401-PLEBegWd";

type TUser = {
  userId: string;
  displayName: string;
  pictureUrl: string;
};

export default function Home() {
  const [user, setUser] = useState<TUser | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  async function init_liff() {
    try {
      await liff.init({ liffId: LIFF_ID }).then(() => {
        if (!liff.isLoggedIn()) {
          liff.login();
          return false;
        }
        console.log("LIFF init succeeded.");
        liff.getProfile().then((profile: any) => {
          setUser(profile);
        });
      });
    } catch (error) {
      console.error(error);
      console.log("LIFF init failed.");
    }
  }
  useEffect(() => {
    init_liff();
  }, [liff.isLoggedIn]);

  function getUserProfile() {
    console.log(user);
  }

  async function logout() {
    try {
      liff.logout();
      window.location.reload();
    } catch (error) {
      console.log("LIFF logout failed.");
    }
  }
  async function getIdToken() {
    try {
      const idToken = liff.getAccessToken();
      console.log(idToken);
    } catch (error) {
      console.log("LIFF getIDToken failed.");
    }
  }
  async function sendMessage(message: string) {
    try {
      const res = await axios({
        method: "post",
        url: "/api/send_message",
        data: {
          userId: user?.userId,
          message: message,
        },
      });
      console.log(res.data);
      messageApi.success(res.data.message);
      setTimeout(() => {
        liff.closeWindow();
      }, 1000);
    } catch (error: any) {
      console.log(error);
      messageApi.error(error.response.data.message);
    }
  }
  return (
    <>
      {user ? (
        <>
          {contextHolder}
          <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
              <p
                onClick={() => {
                  logout();
                }}
                className="fixed cursor-pointer left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
              >
                <code className="font-mono font-bold">Logout</code>
              </p>
              <p
                onClick={() => {
                  getIdToken();
                }}
                className="fixed cursor-pointer left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit hidden lg:block lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
              >
                <code className="font-mono font-bold">Get Token</code>
              </p>
              <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                <div
                  onClick={() => {
                    getUserProfile();
                  }}
                  className="cursor-pointer pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                >
                  By <h3>{user?.displayName}</h3>
                </div>
              </div>
            </div>

            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
              <Image
                className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                src="/next.svg"
                alt="Next.js Logo"
                width={180}
                height={37}
                priority
              />
            </div>

            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
              <div
                className="group cursor-pointer  rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                onClick={() => {
                  sendMessage("Hello, from web");
                }}
              >
                {" "}
                <h2 className={`mb-3 text-2xl font-semibold`}>
                  Send Hello{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                    -&gt;
                  </span>
                </h2>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                  Send message Hello, form web to line@
                </p>
              </div>
            </div>
          </main>
        </>
      ) : (
        <main className="flex min-h-screen flex-col justify-center items-center p-24">
          <Flex align="center" gap="middle">
            <Spin size="large" />
          </Flex>
        </main>
      )}
    </>
  );
}
