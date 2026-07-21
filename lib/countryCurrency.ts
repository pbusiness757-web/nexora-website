export const countryCurrencyMap = {
  Russia: "RUB",
  Kazakhstan: "KZT",
  Uzbekistan: "UZS",
  Azerbaijan: "AZN",
  Kyrgyzstan: "KGS",
} as const;

export type PayoutCountry = keyof typeof countryCurrencyMap;

export const supportedPayoutCountries = Object.keys(
  countryCurrencyMap
) as PayoutCountry[];

export function getPayoutCurrency(country: string): string {
  return (
    countryCurrencyMap[country as PayoutCountry] ?? countryCurrencyMap.Russia
  );
}
