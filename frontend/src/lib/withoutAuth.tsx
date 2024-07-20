import { getAuthUser } from "@/api/auth";
import { GetServerSideProps, NextComponentType, NextPageContext } from "next";

type AuthProps = {
  // Add any additional props you want to pass to the component here
};

const withoutAuth = <P extends AuthProps>(
  WrappedComponent: NextComponentType<NextPageContext, any, P>,
) => {
  const AuthHOC: NextComponentType<NextPageContext, any, P> = (props) => {
    return <WrappedComponent {...props} />;
  };

  AuthHOC.getInitialProps = async (ctx: NextPageContext) => {
    let componentProps = {};
    if (WrappedComponent.getInitialProps) {
      componentProps = await WrappedComponent.getInitialProps(ctx);
    }

    return { ...componentProps };
  };

  return AuthHOC;
};

export const getServerSideAuthProps: GetServerSideProps = async (context) => {
  // Replace the following line with your actual authentication logic
  const isAuthenticated = await getAuthUser();

  if (isAuthenticated) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // Return additional props here if needed
  };
};

export default withoutAuth;
