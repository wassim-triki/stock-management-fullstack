// pages/protected.tsx
import { IErrorResponse, ISuccessResponse } from "@/api/auth";
import { checkAuth } from "@/lib/auth";
import axiosInstance, { IApiResponse } from "@/lib/axiosInstance";
import { GetServerSideProps } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedPage = () => {
  const [data, setData] = useState<ISuccessResponse | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await checkAuth();
      setData(resp);
    };

    fetchData().catch((err) => console.error(err));
  }, []);
  return (
    <div>
      {data ? (
        <div>{JSON.stringify(data.payload.data)}</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const resp = await checkAuth(ctx);

//   if (!resp) {
//     return {
//       props: {
//         cookie: null,
//       },
//     };
//   }

//   return {
//     props: { ...resp },
//   };
// };

export default ProtectedPage;
