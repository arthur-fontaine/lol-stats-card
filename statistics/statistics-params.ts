import { Context, type Ref } from "effect";
import type { RiotApiMatch } from "../riot-api/domain/model/match";
import type { RiotApiAccount } from "../riot-api/domain/model/account";

export class StatisticsParamsState extends Context.Tag("StatisticsParamsState")<
  StatisticsParamsState,
  Ref.Ref<{
    match: RiotApiMatch;
    account: RiotApiAccount;
  }>
>() { }
