"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormatterForUnit } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Siren, Gem, Vault } from "lucide-react";
import React, { ReactNode, useCallback, useMemo } from "react";
import CountUp from "react-countup";
import { Meteors } from '@/components/ui/meteors';

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

function StatsCards({ from, to, userSettings }: Props) {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForUnit(userSettings.Unit);
  }, [userSettings.Unit]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;

  const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Total Units Moved"
          icon={
            <Gem className="h-14 w-14 p-3 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg hover:shadow-emerald-200/50 transition-all duration-300 ease-in-out transform hover:scale-105" />
          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Total Units Sitting"
          icon={
<Siren className="h-14 w-14 p-3 rounded-full bg-gradient-to-br from-red-400 to-pink-500 text-white shadow-lg hover:shadow-red-200/50 transition-all duration-300 ease-in-out transform hover:scale-10" />          }
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Inventory Total"
          icon={
            <Vault className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCards;

function StatCard({
  // formatter,
  value,
  title,
  icon,
}: {
  // formatter: Intl.NumberFormat;
  icon: ReactNode;
  title: String;
  value: number;
}) {
  // const formatFn = useCallback(
  //   (value: number) => {
  //     return formatter.format(value);
  //   },
  //   [formatter]
  // );
  const formatFn = (value: number) => {
    // You can provide your custom formatting logic here if needed
    return value.toString();
  };
  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
