import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import HighchatsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";

import RadarChart from "./api/chart";

export default function Home() {
  const [apiResults, setApiResults] = useState(null);
  useEffect(() => {
    if (apiResults) return;
    fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
      headers: {
        "X-API-KEY": "RiyGy4mJZ8hLABhCcXYrD9O8qyGrun9FtjPAfTlZ",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.body.getReader()) // ReadableStreamを取得する。
      .then((reader) => {
        // ReadableStream.read()はPromiseを返す。
        // Promiseは{ done, value }として解決される。
        reader.read().then(({ done, value }) => {
          // データを読み込んだとき：doneはfalse, valueは値。
          // データを読み込み終わったとき：doneはtrue, valueはundefined。
          const decoder = new TextDecoder();
          // console.log(JSON.parse(decoder.decode(value)));
          setApiResults(JSON.parse(decoder.decode(value)));
        });
      });
  }, []);

  if (!apiResults) return null;
  console.log(apiResults);

  return (
    <div>
      <Head>
        <title>都道府県別の総人口推移グラフ</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>都道府県別の総人口推移グラフ</h1>
        </div>
        {apiResults.result.map((res) => (
          <button className={styles.button} key={res.prefName}>
            ○{JSON.stringify(res.prefName)}
          </button>
        ))}
        <div>{/* <RadarChart /> */}</div>
      </main>
    </div>
  );
}
