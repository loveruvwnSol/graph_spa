import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import HighchatsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";

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
      .then((response) => response.body.getReader())
      .then((reader) => {
        reader.read().then(({ done, value }) => {
          const decoder = new TextDecoder();
          setApiResults(JSON.parse(decoder.decode(value)));
        });
      });
  }, []);

  if (!apiResults) return null;

  const RadarChart = {
    title: {
      text: "Chart",
    },
    xAxis: {
      categories: ["A", "B", "C"],
    },
    yAxis: {
      categories: ["A", "B", "C"],
    },
    series: [
      {
        data: [1, 2, 3],
      },
    ],
  };

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
          <button
            className={styles.button}
            key={res.prefName}
            onClick={() => {
              console.log(res.prefName);
            }}
          >
            ○{JSON.stringify(res.prefName)}
          </button>
        ))}
        <div className={styles.chartzone}>
          <HighchartsReact highcharts={Highcharts} options={RadarChart} />
        </div>
      </main>
    </div>
  );
}
