import { Units } from "@/lib/units";

export function DateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
}

// export function GetFormatterForUnit(unit: string) {
//   const locale = Units.find((c) => c.value === unit)?.locale;

//   return new Intl.NumberFormat(locale, {
//     style: "unit",
//     unit,
//   });
// }
export function GetFormatterForUnit(unit: string) {
  return unit;
}