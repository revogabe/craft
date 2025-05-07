// NextLayout<{ params: { team: string } }>

// key optional
type NextLayout<P = {}> = {
  children: React.ReactNode;
  params: Promise<P>;
};

// NextPage<{ params: { team: string }, searchParams: { team: string | string[] | undefined } }>;

type NextPage<P = {}, S = {}> = {
  params: Promise<P>;
  searchParams: Promise<S>;
};

export type { NextLayout, NextPage };
