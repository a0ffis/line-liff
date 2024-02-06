"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import liff from "@line/liff";
require("dotenv").config();
import { Flex, Spin, Button, message } from "antd";
import {
  HeartOutlined,
  UserOutlined,
  HomeOutlined,
  HeartFilled,
  HomeFilled,
  ShoppingCartOutlined,
  HeartTwoTone,
} from "@ant-design/icons";
import axios from "axios";
import CardSlide from "./components/card-slide";

const LIFF_ID = process.env.LIFF_ID || "2003144401-PLEBegWd";

type TUser = {
  userId: string;
  displayName: string;
  pictureUrl: string;
};

export default function Home() {
  const [user, setUser] = useState<TUser | null>(null);
  const [breeds, setBreeds] = useState<any[]>([]);
  const [cats, setCats] = useState<any[] | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [favorite, setFavorite] = useState<any[]>([]);

  async function init_liff() {
    try {
      await liff.init({ liffId: LIFF_ID }).then(() => {
        if (!liff.isLoggedIn()) {
          liff.login();
          return false;
        }
        console.log("LIFF init succeeded.");
        liff.getProfile().then((profile: any) => {
          console.log(profile);
          setUser(profile);
        });
        get_master_cat_breeds();
        search_cat();
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
  async function get_master_cat_breeds() {
    try {
      const res = await axios({
        method: "get",
        url: "/api/get_master_cat_breeds",
      });

      setBreeds(res.data.data);
      console.log(res.data.data);
      messageApi.success(res.data.message);
    } catch (error: any) {
      console.log(error);
      messageApi.error(error.response.data.message);
    }
  }
  async function search_cat() {
    try {
      const res = await axios({
        method: "get",
        url: "/api/search_cat",
      });
      const data = res.data.data;

      data.map((item: any, _index: number) => {
        item.breeds[0]["price"] = Math.floor(Math.random() * 1000);
      });
      // randomize array data
      // data.sort(() => Math.random() - 0.5);
      console.log(res.data.data);
      setCats(data.sort(() => Math.random() - 0.5));
      messageApi.success(res.data.message);
    } catch (error: any) {
      console.log(error);
      messageApi.error(error.response.data.message);
    }
  }

  async function add_favorite_cat(data: any) {
    console.log(data);
    console.log(favorite.includes(data));
    favorite.includes(data)
      ? setFavorite(favorite.filter((item) => item.id !== data.id))
      : setFavorite([...favorite, data]);
  }

  async function add_cart(data: any) {
    // math random range 1, 10
    const qty = Math.floor(Math.random() * 10) + 1;
    console.log(qty);
  }
  useEffect(() => {
    console.log(favorite);
  }, [favorite]);
  return (
    <>
      {user ? (
        <>
          {contextHolder}
          <div className="container mx-auto relative py-8 mb-20">
            <CardSlide
              header="Randomize"
              items={cats}
              add_favorite={add_favorite_cat}
              favorite={favorite}
            />
            {breeds &&
              cats &&
              [...Array(breeds.length)].map((_item, index) => {
                const breed = breeds[index];
                const data = [] as any[];
                cats?.find((cat) => {
                  if (cat.breeds[0].id === breed.id) {
                    data.push(cat);
                  }
                });

                return (
                  <div key={index}>
                    {data.length > 0 && (
                      <CardSlide
                        header={breed.name}
                        items={data}
                        add_favorite={add_favorite_cat}
                        favorite={favorite}
                      />
                    )}
                  </div>
                );
              })}
            <div className="fixed w-full bottom-4 left-0 p-6">
              <div className="relative rounded-full overflow-hidden shadow-lg">
                {/* <div className="bg-indigo-50 absolute w-full h-full"></div> */}
                <div className="relative bg-indigo-300 bg-opacity-50 backdrop-blur-lg grid grid-cols-4 justify-center items-center justify-items-center overflow-hidden gap-2 w-full h-16">
                  <div className="">
                    <HomeOutlined className="text-xl text-gray-600" />
                  </div>
                  <div
                    onClick={() => {
                      sendMessage("สวัสดีครับ");
                    }}
                  >
                    <HeartOutlined className="text-xl text-gray-400" />
                  </div>
                  <div>
                    <ShoppingCartOutlined className="text-xl text-gray-400" />
                  </div>
                  <div>
                    <UserOutlined className="text-xl text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
