"use client";
import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import Image from "next/image";
require("dotenv").config();
import {
  Flex,
  Spin,
  Button,
  Space,
  Input,
  Badge,
  Avatar,
  message,
  Drawer,
} from "antd";

import {
  HeartOutlined,
  UserOutlined,
  HomeOutlined,
  HeartFilled,
  HomeFilled,
  ShoppingCartOutlined,
  HeartTwoTone,
  SearchOutlined,
  MinusCircleOutlined,
  CloseOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import CardSlide from "./components/card-slide";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { Are_You_Serious, Miss_Fajardose, NTR } from "next/font/google";
import { ClientReferenceManifestPlugin } from "next/dist/build/webpack/plugins/flight-manifest-plugin";

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
  const [cart, setCart] = useState<any[]>([]);
  const [detail, setDetail] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "favorite" | "cart" | "profile" | "" | "detail"
  >("");
  const [modalPosition, setModalPosition] = useState<
    "left" | "right" | "bottom"
  >("right");

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
  }, []);

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
      // messageApi.success(res.data.message);
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
        // item.breeds[0]["price"] = Math.floor(Math.random() * 1000);
        item.breeds[0]["price"] ||
          (item.breeds[0]["price"] = Math.floor(Math.random() * 1000));
        item.quantity = 1;
      });

      // console.log(res.data.data);
      setCats(data.sort(() => Math.random() - 0.5));
      // messageApi.success(res.data.message);
    } catch (error: any) {
      console.error(error);
      messageApi.error(error.response || "เกิดข้อผิดพลาด");
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
    console.log(data);
    cart.includes(data)
      ? setCart(cart.filter((item) => item.id !== data.id))
      : setCart([...cart, data]);
  }

  async function add_detail(data: any) {
    console.log([data]);
    setDetail([data]);
  }

  async function sendFlexMessage(data: any) {
    try {
      const res = await axios({
        method: "post",
        url: "/api/send_flex_message",
        data: {
          userId: user?.userId,
          message: "Favorite",
          contents: data,
        },
      });
      console.log(res.data);
      messageApi.success(res.data.message);
    } catch (error: any) {
      console.log(error);
      messageApi.error(error.response.data.message);
    }
  }

  function handleOpenDrawer(type: "favorite" | "cart" | "profile" | "detail") {
    if (type === "favorite" || type === "cart") {
      setModalPosition("bottom");
    }
    if (type === "profile" || type === "detail") {
      setModalPosition("right");
    }
    setModalType(type);
    setModalOpen(true);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      {user ? (
        <>
          <Drawer
            width="100vw"
            height="100vh"
            title={modalType.toUpperCase()}
            placement={modalPosition}
            closable={false}
            onClose={() => setModalOpen(false)}
            open={modalOpen}
            extra={
              <Space>
                <CloseOutlined
                  onClick={() => setModalOpen(false)}
                  className="text-gray-500 text-lg cursor-pointer hover:text-gray-600 transition ease-in-out duration-300"
                />
              </Space>
            }
          >
            <div
              id="profile"
              className={
                modalType == "profile"
                  ? "flex flex-col items-center gap-4 -justify-center"
                  : "hidden"
              }
            >
              <div className="flex items-center gap-4">
                <Avatar size={64} src={user.pictureUrl} />
                <div>
                  <h1 className="text-2xl font-bold">{user.displayName}</h1>
                </div>
              </div>
              <Space.Compact className="w-full py-6" size="large">
                <Button
                  type="primary"
                  className="w-full"
                  onClick={() => {
                    logout();
                  }}
                >
                  Logout
                </Button>
              </Space.Compact>
            </div>

            <div
              id="cart"
              className={modalType == "cart" ? "-h-full relative" : "hidden"}
            >
              <div className="flex flex-col items-between">
                <div className="flex flex-col items-center gap-4 -justify-center mb-24">
                  {cart.map((item: any, _index: number) => {
                    return (
                      <div
                        key={item.id}
                        className="grid grid-cols-12 gap-4 w-full rounded-xl p-3 bg-indigo-50 overflow-hidden"
                      >
                        <div className="col-span-3 h-full">
                          <div
                            className="flex w-full relative rounded-xl overflow-hidden"
                            onClick={() => {
                              handleOpenDrawer("detail");
                              add_detail(item);
                            }}
                          >
                            <LazyLoadImage
                              effect="opacity"
                              src={item?.url}
                              className="object-cover aspect-square absolute top-0 left-0 w-full h-full"
                            />
                            <div className="aspect-square w-full h-full bg-gray-100"></div>
                          </div>
                        </div>
                        <div className="w-full col-span-8 flex flex-col justify-between">
                          <div>
                            <h1 className=" font-bold text-gray-800 truncate">
                              {item.breeds[0].name}
                            </h1>
                            <p className="text-lg font-bold text-indigo-600">
                              ${item.breeds[0].price * item.quantity || 1}
                            </p>
                          </div>
                          <div className="flex">
                            <div className="flex items-center gap-2">
                              <MinusCircleOutlined
                                className="text-base cursor-pointer"
                                onClick={() => {
                                  cart[cart.indexOf(item)].quantity > 1
                                    ? cart[cart.indexOf(item)].quantity--
                                    : cart.splice(cart.indexOf(item), 1);
                                  setCart([...cart]);
                                }}
                              />
                              {cart[cart.indexOf(item)].quantity}
                              <PlusCircleOutlined
                                onClick={() => {
                                  cart[cart.indexOf(item)].quantity++;
                                  setCart([...cart]);
                                }}
                                className="text-base cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                className="fixed bottom-2 relative"
                style={{ margin: "-1.5rem" }}
              >
                <Space.Compact
                  className="w-full fixed bottom-0 p-4 bg-indigo-50 rounded shadow-lg"
                  size="large"
                  style={{ width: "inherit" }}
                >
                  <Button
                    disabled={cart && cart.length == 0}
                    type="primary"
                    className="w-full bg-indigo-500 disabled:bg-indigo-300 hover:bg-indigo-600"
                    onClick={() => {
                      sendFlexMessage(cart);
                      setModalOpen(false);
                    }}
                  >
                    Checkout
                  </Button>
                </Space.Compact>
              </div>
            </div>

            <div
              id="detail"
              className={modalType == "detail" ? "-h-full relative" : "hidden"}
            >
              <div>
                <div className="flex w-full relative rounded-xl overflow-hidden">
                  <LazyLoadImage
                    effect="opacity"
                    src={detail[0]?.url}
                    className="object-cover aspect-square absolute top-0 left-0 w-full h-full"
                  />
                  <div className="aspect-square w-full h-full bg-gray-100"></div>
                </div>
                <div className="-card-body pt-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-2xl text-indigo-700">
                      ${detail[0]?.breeds[0].price ?? 0}
                    </h2>
                  </div>
                  <h1 className="text-xl font-bold pt-2">
                    {detail[0]?.breeds[0]?.name}
                  </h1>
                  <p className="text-gray-500 pt-1">
                    {detail[0]?.breeds[0]?.description}
                  </p>
                </div>
              </div>
              <div
                className="fixed w-full bg-indigo-50 bottom-0"
                style={{ marginLeft: "-1.5rem" }}
              >
                <Space.Compact
                  block
                  className="w-full p-4 bg-indigo-50 rounded shadow-lg"
                  size="large"
                  style={{ width: "inherit" }}
                >
                  <Button
                    type="primary"
                    className="w-4/5 bg-indigo-500 hover:bg-indigo-600"
                    onClick={() => {}}
                  >
                    Send Message
                  </Button>
                  <Button
                    type="primary"
                    className="w-1/5 bg-indigo-500 hover:bg-indigo-600 before:bg-indigo-300"
                    onClick={() => {
                      add_cart(detail[0]);
                      setModalOpen(false);
                    }}
                  >
                    <ShoppingCartOutlined className="text-xl inline-flex" />
                  </Button>
                </Space.Compact>
              </div>
            </div>
          </Drawer>
          {contextHolder}
          <div
            id="home"
            className="container mx-auto relative pt-2 pb-8 mb-14 max-w-[478px] scroll-smooth"
          >
            <Space.Compact className="w-full p-4 pb-2" size="large">
              <div className="flex items-center gap-4">
                <Avatar size={64} src={user.pictureUrl} />
                <div>
                  <h1 className="text-2xl font-bold">{user.displayName}</h1>
                  <p className="text-gray-500">The Cat API.</p>
                </div>
              </div>
            </Space.Compact>

            <Space.Compact className="w-full p-4" size="large">
              <Input
                className="active:border-indigo-500 hover:border-indigo-500 focus:border-indigo-500"
                prefix={<SearchOutlined />}
                variant="outlined"
                placeholder="Search..."
              />
            </Space.Compact>
            {cats && (
              <CardSlide
                header="Randomize"
                items={cats}
                add_favorite={add_favorite_cat}
                add_cart={add_cart}
                add_detail={add_detail}
                favorite={favorite}
                open_drawer={handleOpenDrawer}
                cart={cart}
              />
            )}
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
                        add_cart={add_cart}
                        add_detail={add_detail}
                        open_drawer={handleOpenDrawer}
                        favorite={favorite}
                        cart={cart}
                      />
                    )}
                  </div>
                );
              })}
            <div className="fixed w-full bottom-0 left-0 p-6">
              <div className="relative rounded-full overflow-hidden shadow-lg">
                <div className="relative bg-indigo-200 bg-opacity-50 backdrop-blur-lg grid grid-cols-4 justify-center items-center justify-items-center overflow-hidden gap-2 w-full h-16">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      scrollToTop();
                    }}
                  >
                    <Badge size="small">
                      <HomeOutlined className="cursur-pointer text-xl text-gray-500 hover:text-gray-500 transition ease-in-out duration-300" />
                    </Badge>{" "}
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleOpenDrawer("favorite");
                      // sendFlexMessage(favorite);
                    }}
                  >
                    <Badge count={favorite.length} size="small">
                      <HeartOutlined className="text-xl text-gray-400 hover:text-gray-500 transition ease-in-out duration-300" />
                    </Badge>
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleOpenDrawer("cart");
                    }}
                  >
                    <Badge count={cart.length} size="small">
                      <ShoppingCartOutlined className="text-xl text-gray-400 hover:text-gray-500 transition ease-in-out duration-300" />
                    </Badge>
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleOpenDrawer("profile");
                      // logout();
                    }}
                  >
                    <UserOutlined className="text-xl text-gray-400 hover:text-gray-500 transition ease-in-out duration-300" />
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
