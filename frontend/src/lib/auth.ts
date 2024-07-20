// utils/auth.ts
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { IErrorResponse, ISuccessResponse } from "@/api/auth";
import axiosInstance, { IApiResponse } from "./axiosInstance";
import { AxiosError } from "axios";
type ApiResponse = IErrorResponse | ISuccessResponse | undefined;

export async function getAuthUser(
  ctx: GetServerSidePropsContext,
): Promise<{ email: string } | null> {
  const cookie = ctx.req.headers.cookie;
  console.log("Cookie:", cookie); // Debugging cookie

  if (!cookie) {
    return null;
  }
  try {
    const response = await axiosInstance.get("/api/auth/me", {
      headers: {
        Cookie: cookie,
      },
    });
    const apiResponse: ISuccessResponse = response.data as ISuccessResponse;
    console.log("API Response:", apiResponse); // Debugging API response

    return apiResponse.payload.data as { email: string };
  } catch (error) {
    console.error("Error fetching user:", error); // Improved error logging
    return null;
  }
}

// export function withAuth<P extends Record<string, unknown>>(
//   gssp: GetServerSideProps<P>,
// ) {
//   return async (
//     ctx: GetServerSidePropsContext,
//   ): Promise<GetServerSidePropsResult<P>> => {
//     const auth = await checkAuth(ctx);

//     if (!auth?.success) {
//       return {
//         redirect: {
//           destination: "/login",
//           permanent: false,
//         },
//       };
//     }

//     return await gssp(ctx);
//   };
// }

export function withAuth(gssp: GetServerSideProps): GetServerSideProps {
  return async (context) => {
    const user = await getAuthUser(context);

    if (!user) {
      return {
        redirect: { statusCode: 302, destination: "/login" },
      };
    }

    const gsspData = await gssp(context);

    if (!("props" in gsspData)) {
      throw new Error("invalid getSSP result");
    }

    return {
      props: {
        ...(await gsspData.props),
        user,
      },
    };
  };
}

export function withoutAuth<P extends Record<string, unknown>>(
  gssp: GetServerSideProps<P>,
) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    const user = await getAuthUser(ctx);

    if (user) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return await gssp(ctx);
  };
}
