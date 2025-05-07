import type { NextPage } from "@/types/next";
import React, { use } from "react";

export default function TypesPage({
  params,
  searchParams,
}: NextPage<
  { types: string },
  { [key: string]: string | string[] | undefined }
>) {
  const { types } = use(params);
  const { query } = use(searchParams);

  return (
    <div>
      <p>Params: {types}</p>
      <p>Query: {JSON.stringify(query)}</p>
    </div>
  );
}
