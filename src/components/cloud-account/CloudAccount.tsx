import type { ReactElement } from "react";
import { API_BASE_URL } from "../../cloud/store";
import type { CloudSnapshot, CloudStore, SyncStatus } from "../../cloud/types";
import * as s from "./CloudAccount.css";

const STATUS_TEXT: Record<SyncStatus, string> = {
  checking: "계정을 확인하고 있어요.",
  guest:
    "이 기기에 저장됩니다. 로그인하면 후원자는 기기 간에 자동으로 동기화할 수 있어요.",
  local: "이 기기에 저장됩니다. 클라우드 자동 저장은 후원자 혜택이에요.",
  pending: "이 기기에 저장했어요. 클라우드에 반영할 예정입니다.",
  syncing: "클라우드와 동기화하고 있어요.",
  synced: "클라우드에 저장했어요.",
  offline: "오프라인입니다. 이 기기에 저장하고 연결되면 다시 동기화합니다.",
  expired:
    "로그인이 만료되었습니다. 편집 내용은 보관 중이며 같은 계정으로 로그인하면 동기화합니다.",
  "clock-error":
    "기기의 날짜와 시간을 확인한 뒤 다시 편집해 주세요. 현재 내용은 보관 중입니다.",
  error: "동기화하지 못했어요. 편집 내용은 보관 중이며 다시 시도할 수 있습니다."
};

type Props = { snapshot: CloudSnapshot; store: CloudStore };

export function CloudAccount({ snapshot, store }: Props): ReactElement {
  const loginUrl = `${API_BASE_URL}/auth?returnTo=kbo-knit`;
  return (
    <section className={s.container} aria-label="계정과 클라우드 저장">
      <h2 className={s.heading}>계정과 클라우드 저장</h2>
      {snapshot.account && (
        <p>
          {snapshot.account.username ?? snapshot.account.email}
          {snapshot.account.supporter ? " · 후원자" : ""}
        </p>
      )}
      <p role="status" className={s.status}>
        {STATUS_TEXT[snapshot.status]}
      </p>
      {!snapshot.storageAvailable && (
        <p role="alert">
          브라우저 저장소를 사용할 수 없습니다. 창을 닫으면 저장되지 않은 편집
          내용을 잃을 수 있어요.
        </p>
      )}
      <div className={s.actions}>
        {(!snapshot.account || snapshot.status === "expired") && (
          <a className={s.action} href={loginUrl}>
            로그인 / 가입
          </a>
        )}
        <a className={s.action} href={`${API_BASE_URL}/account`}>
          계정 · 후원 관리
        </a>
        {snapshot.account && (
          <button
            className={s.action}
            type="button"
            onClick={() => {
              void store.logout();
            }}
          >
            로그아웃
          </button>
        )}
        {(snapshot.status === "error" || snapshot.status === "clock-error") && (
          <button
            className={s.action}
            type="button"
            onClick={() => {
              void store.refresh();
            }}
          >
            다시 시도
          </button>
        )}
      </div>
    </section>
  );
}
