import React from "react";
import {
  HeartOutlined,
  UserOutlined,
  HomeOutlined,
  HeartFilled,
  HomeFilled,
  ShoppingCartOutlined,
  HeartTwoTone,
} from "@ant-design/icons";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import Image from "next/image";

type Props = {
  header: string;
  items: any[] | null;
  add_favorite: Function;
  add_cart: Function;
  favorite: any[];
  cart: any[];
};

const CardSlide = (props: Props) => {
  const { header, items, add_favorite, add_cart, favorite } = props;

  return (
    <>
      <div className="overflow-hidden">
        <div className="px-4 pb-4">
          <h2 className="text-2xl font-bold">{header}</h2>
        </div>
        <div
          className="flex gap-4 justify-between snap-x overflow-x-scroll pb-6 px-4 scroll-hidden"
          // style={{ width: `calc(65vw * ${cats ? cats.length : 1})` }}
        >
          {items?.map((item, _index) => {
            return (
              <div
                key={item.id}
                className="flex flex-col w-[50vw] rounded-lg h-full snap-center cursor-pointer shadow transition ease-in-out duration-300 hover:shadow-lg relative"
              >
                <div className="overflow-hidden rounded-lg -h-full min-w-[50vw]">
                  <LazyLoadImage
                    effect="opacity"
                    src={item?.url}
                    width="100%"
                    style={{
                      aspectRatio: "1/1",
                      objectFit: "cover",
                    }}
                  />
                  {/* <div */}
                  {/*   className="pt-[100%] w-full bg-cover bg-center" */}
                  {/*   style={{ backgroundImage: `url(${item?.url})` }} */}
                  {/* ></div> */}
                  <div
                    className="p-3 -h-[38%] flex flex-col justify-between"
                    style={{ width: "inherit" }}
                  >
                    <h1 className="text-lg font-bold text-gray-800 truncate">
                      {item.breeds[0].name}
                    </h1>
                    <div className="text-xs overflow-hidden truncate-2-lines text-gray-500">
                      <p className="inline">
                        {item.breeds[0].description || "-"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-3 p-1">
                      <h2 className="font-bold text-xl text-indigo-700">
                        ${item.breeds[0].price}
                      </h2>
                      <div
                        onClick={() => {
                          add_cart(item);
                        }}
                      >
                        <ShoppingCartOutlined className="text-gray-400 text-2xl hover:text-indigo-700 transition ease-in-out duration-300 cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-2 left-2 bg-indigo-500 rounded">
                    <p className="text-white py-0.5 px-1.5">
                      {item.breeds[0].country_code}
                    </p>
                  </div>
                  <div
                    className="absolute top-2.5 right-2"
                    onClick={() => {
                      add_favorite(item);
                    }}
                  >
                    <HeartTwoTone
                      style={{ fontSize: "1.5rem" }}
                      className="transition ease-in-out duration-300 cursor-pointer"
                      // twoToneColor="#eb2f96"
                      twoToneColor={favorite?.includes(item) ? "#eb2f96" : ""}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CardSlide;
