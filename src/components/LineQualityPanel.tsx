import React from "react";
import { Flex, Text, Badge } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import type { Record as LiveRecord } from "@/types/LiveData";
import { parseLineInfo, type NodeBasicInfo } from "@/contexts/NodeListContext";
import { Skeletonize, skeletonText } from "@/components/ui/skeleton";

/**
 * LineQualityPanel —— 在服务器卡片中展示"当前线路"与"重传测试"。
 *
 * 线路名由探针（komari-agent）自动识别出口 IP 的 ASN 得出，随 basicInfo 上报；
 * 重传率由探针读取内核 TCP 统计得出，随实时 report 上报。
 * 本组件只做展示，不提供任何手动输入控件。
 */
type Props = {
  basic: NodeBasicInfo;
  live?: LiveRecord;
  isMobile?: boolean;
  loading?: boolean;
};

const LINE_COLORS: Record<string, string> = {
  cn2gia: "#e5484d",
  cn2gt: "#f2824b",
  "9929": "#3b82f6",
  "4837": "#8b5cf6",
  cmin: "#16b364",
  "163": "#d97706",
};

function SegmentedBar({ ratio, color }: { ratio: number; color: string }) {
  const on = Math.max(0, Math.min(12, Math.round(ratio * 12)));
  return (
    <Flex gap="1" style={{ height: 11, flex: 1, alignItems: "stretch" }} aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          style={{
            flex: 1,
            borderRadius: 2,
            background: i < on ? color : "var(--gray-3, #eef1f5)",
            transition: "background .35s ease",
          }}
        />
      ))}
    </Flex>
  );
}

const LineQualityPanel = ({ basic, live, isMobile = false, loading = false }: Props) => {
  const [t] = useTranslation();
  const line = React.useMemo(() => parseLineInfo(basic.line_info), [basic.line_info]);
  const retransmit = live?.retransmit;
  const rate = retransmit?.available ? Number(retransmit.rate || 0) : 0;
  const rateText = retransmit?.available ? `${rate.toFixed(2)}%` : "-";
  const level = rate >= 3 ? "火" : rate >= 1 ? "警" : "佳";
  const levelColor = rate >= 3 ? "#ef5350" : rate >= 1 ? "#f5a623" : "#16b364";
  const barColor = "#3b82f6";
  const dotColor = line ? LINE_COLORS[line.id] || "#94a3b8" : "#b9c0c9";

  return (
    <Flex direction="column" gap="2" className="km-line-quality">
      {/* 当前线路：探针自动识别 */}
      <Flex justify="between" align="center" gap="2">
        <Text size="2" color="gray">{t("lineQuality.currentLine", "当前线路")}</Text>
        <Flex align="center" gap="2" style={{ minWidth: 0 }}>
          {loading ? (
            <Skeletonize as="span" loading>{skeletonText(8)}</Skeletonize>
          ) : line ? (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, flex: "0 0 auto" }} aria-hidden />
              <Text size="2" weight="bold" style={{ whiteSpace: "nowrap" }}>{line.name}</Text>
              {line.asn > 0 && (
                <Text size="1" color="gray">AS{line.asn}</Text>
              )}
              <Badge color="green" variant="soft" size="1">
                {t("lineQuality.auto", "自动识别")}
              </Badge>
            </>
          ) : (
            <Text size="2" color="gray">{t("lineQuality.detecting", "探针检测中")}</Text>
          )}
        </Flex>
      </Flex>

      {/* 重传测试：新增指标 */}
      <Flex direction="column" gap="1">
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            <Text size="2" color="gray">{t("lineQuality.retransmit", "重传测试")}</Text>
            <Badge color="blue" variant="solid" size="1">NEW</Badge>
          </Flex>
          <Text size="2" weight="bold" style={{ color: levelColor, fontVariantNumeric: "tabular-nums" }}>
            {loading ? skeletonText(5) : rateText}
          </Text>
        </Flex>
        <SegmentedBar ratio={Math.min(1, rate / 5)} color={barColor} />
        {!isMobile && (
          <Flex justify="between">
            <Text size="1" color="gray">
              {t("lineQuality.retransSegs", "重传报文")}: {retransmit?.available ? String(retransmit.retrans ?? 0) : "-"}
            </Text>
            <Text size="1" color="gray">
              {t("lineQuality.outSegs", "发送报文")}: {retransmit?.available ? String(retransmit.out_segs ?? 0) : "-"}
            </Text>
          </Flex>
        )}
      </Flex>
      <Text size="1" color="gray" style={{ opacity: .75 }}>
        {t("lineQuality.level", "链路质量")}: {level} · {t("lineQuality.autoHint", "数据由探针自动采集")}
      </Text>
    </Flex>
  );
};

export default LineQualityPanel;
