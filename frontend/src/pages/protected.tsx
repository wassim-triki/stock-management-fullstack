import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import axiosInstance from "@/lib/axiosInstance";

type Props = {
  data: object;
};

async function fetchApi(): Promise<object> {
  const resp: AxiosResponse = await axiosInstance.get(
    "http://localhost:4000/api/auth/check-session",
  );

  return resp.data as object;
}

const Protected: React.FC<Props> = ({ data }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <p>{isClient ? "Client-side Rendered" : "Server-side Rendered"}</p>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await fetchApi();

  return {
    props: {
      data,
    },
  };
};

export default Protected;
