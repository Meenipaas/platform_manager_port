import { Chart } from '@antv/g2';
import { useEffect, useRef } from 'react';

/**
 * 完成数值，
 * @param data
 * @returns
 */

export function ActiveChart({ data }: { data?: API.PerData[] }) {
  const chartDom = useRef<HTMLDivElement>(null);

  const renderChart = (container: HTMLElement) => {
    const chart = new Chart({
      container,
      autoFit: true,
      height: 200,
    });
    if (data) {
      chart.data(data);
    }
    chart.scale({
      cpu: {
        max: 100,
        min: 0,
      },
    });

    chart.line().position('time*data').color('date', ['#1890ff', '#ced4d9']).shape('split-line');
    chart.point().position('time*data').shape('breath-point');
    chart.annotation().regionFilter({
      top: true,
      start: ['min', 105],
      end: ['max', 85],
      color: '#ff4d4f',
    });
    chart.annotation().line({
      start: ['min', 85],
      end: ['max', 85],
      style: {
        stroke: '#ff4d4f',
        lineWidth: 1,
        lineDash: [3, 3],
      },
      text: {
        position: 'start',
        style: {
          fill: '#8c8c8c',
          fontSize: 15,
          fontWeight: 'normal',
        },
        content: '预警线 85%',
        offsetY: -5,
      },
    });

    chart.render();
  };

  useEffect(() => {
    if (chartDom && chartDom.current) {
      renderChart(chartDom.current);
    }
  }, []);

  return <div ref={chartDom} />;
}
