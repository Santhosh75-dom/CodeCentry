import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout/Layout";
import { useSubmissionSimulator } from "@/hooks/useSubmissionSimulator";

export default function App({ Component, pageProps }: AppProps) {
  // Start the background contest submission grading simulator
  useSubmissionSimulator();

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}


