"""
논문용 시각화 모듈
==================
캡스톤 논문에 실을 수 있는 수준의 차트를 생성한다.
한글 폰트 지원, 고해상도(300 DPI) PNG 저장.
"""

import os
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np

from optimizer.benchmark import BenchmarkReport, CategoryStats

# ─── 한글 폰트 ───
matplotlib.rcParams["font.family"] = "AppleGothic"
matplotlib.rcParams["axes.unicode_minus"] = False

# ─── 논문용 스타일 ───
PAPER_STYLE = {
    "figure.dpi": 300,
    "savefig.dpi": 300,
    "font.size": 11,
    "axes.titlesize": 13,
    "axes.labelsize": 12,
    "xtick.labelsize": 10,
    "ytick.labelsize": 10,
    "legend.fontsize": 10,
    "figure.figsize": (8, 5),
    "axes.grid": True,
    "grid.alpha": 0.3,
}

COLORS = {
    "primary": "#4361EE",
    "secondary": "#7209B7",
    "accent": "#F72585",
    "success": "#06D6A0",
    "warning": "#FFD166",
    "info": "#118AB2",
    "categories": ["#4361EE", "#7209B7", "#F72585", "#06D6A0", "#FFD166", "#118AB2"],
}


def _apply_style():
    plt.rcParams.update(PAPER_STYLE)


def save_fig(fig, filepath: str):
    """고해상도로 저장"""
    os.makedirs(os.path.dirname(filepath) if os.path.dirname(filepath) else ".", exist_ok=True)
    fig.savefig(filepath, dpi=300, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def plot_category_reduction(report: BenchmarkReport, save_path: str | None = None):
    """
    Figure 1: 카테고리별 평균 토큰 절감률 막대 그래프
    (오차 막대 포함)
    """
    _apply_style()
    fig, ax = plt.subplots(figsize=(8, 5))

    cats = [s.category for s in report.category_stats]
    means = [s.avg_reduction_rate * 100 for s in report.category_stats]
    stds = [s.std_reduction_rate * 100 for s in report.category_stats]

    bars = ax.bar(cats, means, yerr=stds, capsize=5,
                  color=COLORS["categories"][:len(cats)], edgecolor="white",
                  linewidth=1.5, alpha=0.85, error_kw={"linewidth": 1.5})

    # 값 표시
    for bar, m in zip(bars, means):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1.5,
                f"{m:.1f}%", ha="center", va="bottom", fontweight="bold", fontsize=11)

    ax.set_ylabel("토큰 절감률 (%)")
    ax.set_title("카테고리별 평균 토큰 절감률 (±표준편차)")
    ax.set_ylim(0, max(means) + max(stds) + 8)
    ax.yaxis.set_major_formatter(mticker.FormatStrFormatter("%.0f%%"))

    plt.tight_layout()
    if save_path:
        save_fig(fig, save_path)
    return fig


def plot_token_comparison(report: BenchmarkReport, save_path: str | None = None):
    """
    Figure 2: 카테고리별 원본 vs 최적화 토큰 수 비교
    """
    _apply_style()
    fig, ax = plt.subplots(figsize=(8, 5))

    cats = [s.category for s in report.category_stats]
    orig = [s.avg_original_tokens for s in report.category_stats]
    refined = [s.avg_refined_tokens for s in report.category_stats]

    x = np.arange(len(cats))
    width = 0.35

    bars1 = ax.bar(x - width / 2, orig, width, label="원본", color="#EF476F", alpha=0.85)
    bars2 = ax.bar(x + width / 2, refined, width, label="최적화 후", color="#06D6A0", alpha=0.85)

    # 값 표시
    for bar in bars1:
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.5,
                f"{bar.get_height():.0f}", ha="center", va="bottom", fontsize=9)
    for bar in bars2:
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.5,
                f"{bar.get_height():.0f}", ha="center", va="bottom", fontsize=9)

    ax.set_ylabel("평균 토큰 수")
    ax.set_title("카테고리별 최적화 전후 평균 토큰 수 비교")
    ax.set_xticks(x)
    ax.set_xticklabels(cats)
    ax.legend()

    plt.tight_layout()
    if save_path:
        save_fig(fig, save_path)
    return fig


def plot_pattern_frequency(report: BenchmarkReport, save_path: str | None = None):
    """
    Figure 3: 패턴별 출현 빈도 가로 막대 그래프
    """
    _apply_style()
    fig, ax = plt.subplots(figsize=(8, 5))

    freq = report.overall_stats.get("pattern_frequency", {})
    if not freq:
        return fig

    patterns = list(freq.keys())
    counts = list(freq.values())

    colors = COLORS["categories"][:len(patterns)]
    bars = ax.barh(patterns, counts, color=colors, edgecolor="white", linewidth=1.2, alpha=0.85)

    for bar, c in zip(bars, counts):
        ax.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height() / 2,
                f"{c}건", ha="left", va="center", fontsize=10)

    ax.set_xlabel("출현 빈도 (프롬프트 수)")
    ax.set_title("낭비 패턴별 출현 빈도")
    ax.invert_yaxis()

    plt.tight_layout()
    if save_path:
        save_fig(fig, save_path)
    return fig


def plot_reduction_distribution(report: BenchmarkReport, save_path: str | None = None):
    """
    Figure 4: 전체 프롬프트의 토큰 절감률 분포 (히스토그램 + 박스플롯)
    """
    _apply_style()
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

    rates = [r.reduction_rate * 100 for r in report.results]

    # 히스토그램
    ax1.hist(rates, bins=10, color=COLORS["primary"], edgecolor="white",
             linewidth=1.2, alpha=0.85)
    ax1.axvline(np.mean(rates), color=COLORS["accent"], linestyle="--",
                linewidth=2, label=f"평균: {np.mean(rates):.1f}%")
    ax1.axvline(np.median(rates), color=COLORS["success"], linestyle="--",
                linewidth=2, label=f"중앙값: {np.median(rates):.1f}%")
    ax1.set_xlabel("토큰 절감률 (%)")
    ax1.set_ylabel("프롬프트 수")
    ax1.set_title("토큰 절감률 분포 (히스토그램)")
    ax1.legend()

    # 카테고리별 박스플롯
    cat_data = {}
    for r in report.results:
        cat_data.setdefault(r.category, []).append(r.reduction_rate * 100)

    labels = list(cat_data.keys())
    data = [cat_data[l] for l in labels]

    bp = ax2.boxplot(data, labels=labels, patch_artist=True, widths=0.6)
    for patch, color in zip(bp["boxes"], COLORS["categories"][:len(labels)]):
        patch.set_facecolor(color)
        patch.set_alpha(0.6)
    for median_line in bp["medians"]:
        median_line.set_color("black")
        median_line.set_linewidth(2)

    ax2.set_ylabel("토큰 절감률 (%)")
    ax2.set_title("카테고리별 절감률 분포 (박스플롯)")

    plt.tight_layout()
    if save_path:
        save_fig(fig, save_path)
    return fig


def plot_cost_simulation(report: BenchmarkReport, save_path: str | None = None):
    """
    Figure 5: 일일 호출 횟수별 연간 비용 절감 시뮬레이션
    """
    _apply_style()
    fig, ax = plt.subplots(figsize=(8, 5))

    # 전체 평균 절감 비용 사용
    avg_cost_saved = report.overall_stats.get("total_cost_saved", 0) / report.total_samples

    daily_calls = [10, 50, 100, 500, 1000, 5000, 10000]
    yearly_savings = [avg_cost_saved * dc * 365 for dc in daily_calls]

    ax.plot(daily_calls, yearly_savings, "o-", color=COLORS["primary"],
            linewidth=2.5, markersize=8, markerfacecolor="white",
            markeredgecolor=COLORS["primary"], markeredgewidth=2)

    for x, y in zip(daily_calls, yearly_savings):
        ax.annotate(f"${y:.2f}", (x, y), textcoords="offset points",
                    xytext=(0, 12), ha="center", fontsize=9)

    ax.set_xlabel("일일 API 호출 횟수")
    ax.set_ylabel("연간 절감액 (USD)")
    ax.set_title(f"일일 호출 횟수별 연간 비용 절감 추정 (모델: {report.model})")
    ax.set_xscale("log")

    plt.tight_layout()
    if save_path:
        save_fig(fig, save_path)
    return fig


def plot_before_after_scatter(report: BenchmarkReport, save_path: str | None = None):
    """
    Figure 6: 원본 토큰 vs 최적화 토큰 산점도
    """
    _apply_style()
    fig, ax = plt.subplots(figsize=(7, 7))

    cat_map = {}
    for r in report.results:
        cat_map.setdefault(r.category, {"orig": [], "refined": []})
        cat_map[r.category]["orig"].append(r.original_tokens)
        cat_map[r.category]["refined"].append(r.refined_tokens)

    for i, (cat, vals) in enumerate(cat_map.items()):
        ax.scatter(vals["orig"], vals["refined"],
                   color=COLORS["categories"][i % len(COLORS["categories"])],
                   label=cat, s=60, alpha=0.7, edgecolors="white", linewidth=0.8)

    # y=x 대각선 (변화 없음 기준선)
    max_val = max(max(r.original_tokens for r in report.results),
                  max(r.refined_tokens for r in report.results))
    ax.plot([0, max_val * 1.1], [0, max_val * 1.1], "--",
            color="gray", alpha=0.5, label="변화 없음 (y=x)")

    ax.set_xlabel("원본 토큰 수")
    ax.set_ylabel("최적화 후 토큰 수")
    ax.set_title("원본 vs 최적화 토큰 수 (산점도)")
    ax.legend(loc="upper left")
    ax.set_aspect("equal", adjustable="box")

    plt.tight_layout()
    if save_path:
        save_fig(fig, save_path)
    return fig


def generate_all_figures(report: BenchmarkReport, output_dir: str):
    """모든 논문용 차트를 생성하고 저장한다."""
    os.makedirs(output_dir, exist_ok=True)

    figures = {
        "fig1_category_reduction.png": plot_category_reduction,
        "fig2_token_comparison.png": plot_token_comparison,
        "fig3_pattern_frequency.png": plot_pattern_frequency,
        "fig4_reduction_distribution.png": plot_reduction_distribution,
        "fig5_cost_simulation.png": plot_cost_simulation,
        "fig6_scatter_plot.png": plot_before_after_scatter,
    }

    saved = []
    for filename, plot_fn in figures.items():
        path = os.path.join(output_dir, filename)
        plot_fn(report, save_path=path)
        saved.append(path)

    return saved


# ═══════════════════════════════════════
# 하이브리드 비교 차트 (논문용)
# ═══════════════════════════════════════

def plot_hybrid_comparison(hybrid_report, save_path: str | None = None):
    """
    Figure 7: 규칙 기반 vs 하이브리드 카테고리별 절감률 비교
    (그룹 바 차트)
    """
    _apply_style()
    fig, ax = plt.subplots(figsize=(10, 6))

    cats = [s.category for s in hybrid_report.category_stats]
    rb_means = [s.rb_avg_reduction * 100 for s in hybrid_report.category_stats]
    hy_means = [s.hy_avg_reduction * 100 for s in hybrid_report.category_stats]
    rb_stds = [s.rb_std_reduction * 100 for s in hybrid_report.category_stats]
    hy_stds = [s.hy_std_reduction * 100 for s in hybrid_report.category_stats]

    x = np.arange(len(cats))
    width = 0.35

    bars1 = ax.bar(x - width / 2, rb_means, width, yerr=rb_stds, capsize=4,
                   label="규칙 기반", color="#4361EE", alpha=0.85,
                   edgecolor="white", linewidth=1.2, error_kw={"linewidth": 1.2})
    bars2 = ax.bar(x + width / 2, hy_means, width, yerr=hy_stds, capsize=4,
                   label="하이브리드", color="#F72585", alpha=0.85,
                   edgecolor="white", linewidth=1.2, error_kw={"linewidth": 1.2})

    # 값 표시
    for bar, m in zip(bars1, rb_means):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1.5,
                f"{m:.1f}%", ha="center", va="bottom", fontsize=9, color="#4361EE")
    for bar, m in zip(bars2, hy_means):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1.5,
                f"{m:.1f}%", ha="center", va="bottom", fontsize=9, color="#F72585",
                fontweight="bold")

    # 전체 평균 표시
    overall_rb = hybrid_report.overall_rb_avg_reduction * 100
    overall_hy = hybrid_report.overall_hy_avg_reduction * 100
    ax.axhline(overall_rb, color="#4361EE", linestyle="--", alpha=0.4,
               label=f"규칙 기반 평균: {overall_rb:.1f}%")
    ax.axhline(overall_hy, color="#F72585", linestyle="--", alpha=0.4,
               label=f"하이브리드 평균: {overall_hy:.1f}%")

    ax.set_ylabel("토큰 절감률 (%)")
    ax.set_title("규칙 기반 vs 하이브리드: 카테고리별 평균 절감률 비교")
    ax.set_xticks(x)
    ax.set_xticklabels(cats)
    ax.set_ylim(0, max(max(rb_means), max(hy_means)) + max(max(rb_stds), max(hy_stds)) + 8)
    ax.legend(loc="upper right")
    ax.yaxis.set_major_formatter(mticker.FormatStrFormatter("%.0f%%"))

    plt.tight_layout()
    if save_path:
        save_fig(fig, save_path)
    return fig


def plot_hybrid_improvement(hybrid_report, save_path: str | None = None):
    """
    Figure 8: 프롬프트별 하이브리드 추가 개선 효과
    (통계 검정 결과 표시)
    """
    _apply_style()
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

    # 왼쪽: 프롬프트별 개선률 바 차트
    improvements = [r.improvement * 100 for r in hybrid_report.results]
    categories = [r.category for r in hybrid_report.results]
    ids = list(range(1, len(improvements) + 1))

    # 카테고리별 색상
    cat_colors = {}
    for i, cat in enumerate(dict.fromkeys(categories)):
        cat_colors[cat] = COLORS["categories"][i % len(COLORS["categories"])]
    colors = [cat_colors[c] for c in categories]

    bars = ax1.bar(ids, improvements, color=colors, alpha=0.8, edgecolor="white")
    ax1.axhline(0, color="black", linewidth=0.8)

    # 평균선
    avg_imp = hybrid_report.overall_improvement * 100
    ax1.axhline(avg_imp, color=COLORS["accent"], linestyle="--", linewidth=2,
                label=f"평균 개선: +{avg_imp:.2f}%p")

    ax1.set_xlabel("프롬프트 번호")
    ax1.set_ylabel("추가 개선율 (%p)")
    ax1.set_title("프롬프트별 하이브리드 추가 개선 효과")
    ax1.legend()

    # 카테고리 범례
    for cat, color in cat_colors.items():
        ax1.bar([], [], color=color, label=cat, alpha=0.8)
    ax1.legend(loc="upper right", fontsize=8)

    # 오른쪽: 통계 검정 결과 요약 텍스트
    ax2.axis("off")
    stat_tests = hybrid_report.statistical_tests
    text_lines = [
        "━━ 통계 검정 결과 ━━\n",
        f"표본 수 (n): {hybrid_report.total_samples}건\n",
        f"\n규칙 기반 평균 절감률: {hybrid_report.overall_rb_avg_reduction * 100:.2f}%",
        f"하이브리드 평균 절감률: {hybrid_report.overall_hy_avg_reduction * 100:.2f}%",
        f"차이 (개선): +{hybrid_report.overall_improvement * 100:.2f}%p\n",
    ]

    if "effect_size" in stat_tests:
        es = stat_tests["effect_size"]
        text_lines.append(f"\n━━ 효과 크기 (Effect Size) ━━")
        text_lines.append(f"Cohen's d = {es['cohens_d']:.4f}")
        text_lines.append(f"해석: {es['interpretation']}")

    if "paired_ttest" in stat_tests:
        tt = stat_tests["paired_ttest"]
        text_lines.append(f"\n━━ Paired t-test ━━")
        text_lines.append(f"t = {tt.get('t_statistic', 'N/A')}")
        if "p_value" in tt:
            text_lines.append(f"p = {tt['p_value']:.6f}")
            sig = "✅ 유의" if tt.get("significant_005") else "❌ 비유의"
            text_lines.append(f"α=0.05: {sig}")

    if "wilcoxon" in stat_tests and "statistic" in stat_tests["wilcoxon"]:
        wt = stat_tests["wilcoxon"]
        text_lines.append(f"\n━━ Wilcoxon signed-rank ━━")
        text_lines.append(f"W = {wt['statistic']}")
        text_lines.append(f"p = {wt['p_value']:.6f}")
        sig = "✅ 유의" if wt.get("significant_005") else "❌ 비유의"
        text_lines.append(f"α=0.05: {sig}")

    ax2.text(0.1, 0.95, "\n".join(text_lines), transform=ax2.transAxes,
             fontsize=11, verticalalignment="top", fontfamily="monospace",
             bbox=dict(boxstyle="round,pad=0.8", facecolor="#f8f9fa",
                       edgecolor="#dee2e6", alpha=0.9))

    plt.tight_layout()
    if save_path:
        save_fig(fig, save_path)
    return fig


def plot_hybrid_scatter(hybrid_report, save_path: str | None = None):
    """
    Figure 9: 규칙 기반 vs 하이브리드 절감률 산점도
    """
    _apply_style()
    fig, ax = plt.subplots(figsize=(7, 7))

    cat_map = {}
    for r in hybrid_report.results:
        cat_map.setdefault(r.category, {"rb": [], "hy": []})
        cat_map[r.category]["rb"].append(r.rule_based_reduction * 100)
        cat_map[r.category]["hy"].append(r.hybrid_reduction * 100)

    for i, (cat, vals) in enumerate(cat_map.items()):
        ax.scatter(vals["rb"], vals["hy"],
                   color=COLORS["categories"][i % len(COLORS["categories"])],
                   label=cat, s=80, alpha=0.7, edgecolors="white", linewidth=1)

    # y=x 대각선 (동일 성능 기준선)
    max_val = 60
    ax.plot([0, max_val], [0, max_val], "--", color="gray", alpha=0.5,
            label="동일 성능 (y=x)")

    ax.set_xlabel("규칙 기반 절감률 (%)")
    ax.set_ylabel("하이브리드 절감률 (%)")
    ax.set_title("규칙 기반 vs 하이브리드 절감률 (산점도)")
    ax.legend(loc="upper left")
    ax.set_aspect("equal", adjustable="box")
    ax.set_xlim(0, max_val)
    ax.set_ylim(0, max_val)

    plt.tight_layout()
    if save_path:
        save_fig(fig, save_path)
    return fig


def generate_hybrid_figures(hybrid_report, output_dir: str):
    """하이브리드 비교 논문용 차트를 생성하고 저장한다."""
    os.makedirs(output_dir, exist_ok=True)

    figures = {
        "fig7_hybrid_comparison.png": plot_hybrid_comparison,
        "fig8_hybrid_improvement.png": plot_hybrid_improvement,
        "fig9_hybrid_scatter.png": plot_hybrid_scatter,
    }

    saved = []
    for filename, plot_fn in figures.items():
        path = os.path.join(output_dir, filename)
        plot_fn(hybrid_report, save_path=path)
        saved.append(path)

    return saved
