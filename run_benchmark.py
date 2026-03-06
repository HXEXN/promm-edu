"""벤치마크 실험 실행 및 결과 수집 스크립트"""
import json
from optimizer.benchmark import BenchmarkRunner

runner = BenchmarkRunner(model="gpt-4o-mini")
report = runner.run()

# CSV/JSON 저장
BenchmarkRunner.export_csv(report, "results/benchmark_results.csv")
BenchmarkRunner.export_json(report, "results/benchmark_results.json")

# 차트 저장
from optimizer.charts import generate_all_figures
saved = generate_all_figures(report, "results/figures")

# 결과 출력
print("=" * 60)
print(f"총 샘플: {report.total_samples}건")
print(f"모델: {report.model}")
print("=" * 60)

os = report.overall_stats
print(f"\n[전체 통계]")
print(f"  평균 절감률: {os['avg_reduction_rate']*100:.2f}%")
print(f"  중앙값 절감률: {os['median_reduction_rate']*100:.2f}%")
print(f"  표준편차: {os['std_reduction_rate']*100:.2f}%")
print(f"  최소~최대: {os['min_reduction_rate']*100:.2f}% ~ {os['max_reduction_rate']*100:.2f}%")
print(f"  평균 원본 토큰: {os['avg_original_tokens']:.1f}")
print(f"  평균 최적화 토큰: {os['avg_refined_tokens']:.1f}")
print(f"  평균 절감 토큰: {os['avg_saved_tokens']:.1f}")
print(f"  총 절감 토큰: {os['total_tokens_saved']}")

print(f"\n[카테고리별 통계]")
for s in report.category_stats:
    print(f"  {s.category}: 평균 {s.avg_reduction_rate*100:.2f}% (±{s.std_reduction_rate*100:.2f}%), "
          f"원본 {s.avg_original_tokens:.0f} → 최적화 {s.avg_refined_tokens:.0f} 토큰")

print(f"\n[패턴 빈도]")
for pat, cnt in os['pattern_frequency'].items():
    print(f"  {pat}: {cnt}건 ({cnt/report.total_samples*100:.0f}%)")

print(f"\n[저장 완료]")
print(f"  CSV: results/benchmark_results.csv")
print(f"  JSON: results/benchmark_results.json")
for p in saved:
    print(f"  차트: {p}")
