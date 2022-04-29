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
  const [apiPopulation, setApiPopulation] = useState(null);

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

    if (apiPopulation) return;
    fetch(
      "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=11362&prefCode=11",
      {
        headers: {
          "X-API-KEY": "RiyGy4mJZ8hLABhCcXYrD9O8qyGrun9FtjPAfTlZ",
          "Content-Type": "application/json;charset=UTF-8",
        },
      }
    )
      .then((response) => response.body.getReader())
      .then((reader) => {
        reader.read().then(({ done, value }) => {
          const dcdr = new TextDecoder();
          console.log(JSON.parse(dcdr.decode(value)));
          setApiPopulation(JSON.parse(dcdr.decode(value)));
        });
      });
  }, []);

  if (!apiResults) return null;
  if (!apiPopulation) return null;

  const RadarChart = {
    title: {
      text: "都道府県別人口推移",
    },
    xAxis: {
      categories: [
        apiPopulation.result.data[0].data[0].year,
        apiPopulation.result.data[0].data[1].year,
        apiPopulation.result.data[0].data[2].year,
        apiPopulation.result.data[0].data[3].year,
        apiPopulation.result.data[0].data[4].year,
        apiPopulation.result.data[0].data[5].year,
        apiPopulation.result.data[0].data[6].year,
        apiPopulation.result.data[0].data[7].year,
        apiPopulation.result.data[0].data[8].year,
        apiPopulation.result.data[0].data[9].year,
      ],
      title: {
        text: "年度 (年度)",
      },
    },
    yAxis: {
      categories: ["400k", "600k", "800k", "1000k", "1200k", "1400k"],
      title: {
        text: "人口 (人)",
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },
    series: [
      {
        name: apiResults.result.prefName,
        data: [
          apiPopulation.result.data[0].data[0].value,
          apiPopulation.result.data[0].data[1].value,
          apiPopulation.result.data[0].data[2].value,
          apiPopulation.result.data[0].data[3].value,
          apiPopulation.result.data[0].data[4].value,
          apiPopulation.result.data[0].data[5].value,
          apiPopulation.result.data[0].data[6].value,
          apiPopulation.result.data[0].data[7].value,
          apiPopulation.result.data[0].data[8].value,
          apiPopulation.result.data[0].data[9].value,
        ],
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
