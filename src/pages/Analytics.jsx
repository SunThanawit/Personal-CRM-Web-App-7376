import React from 'react';
import { motion } from 'framer-motion';
import { useCRM } from '../context/CRMContext';
import { format, subDays, subMonths, isAfter, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import ReactECharts from 'echarts-for-react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiUsers, FiMessageSquare, FiCalendar } = FiIcons;

const Analytics = () => {
  const { contacts, interactions } = useCRM();

  // Calculate metrics
  const totalContacts = contacts.length;
  const totalInteractions = interactions.length;
  const activeContacts = contacts.filter(c => 
    c.lastContact && isAfter(new Date(c.lastContact), subDays(new Date(), 30))
  ).length;
  
  const interactionsThisMonth = interactions.filter(i => 
    isAfter(new Date(i.createdAt), startOfMonth(new Date()))
  ).length;

  // Prepare data for charts
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date()
  });

  const dailyInteractions = last30Days.map(day => {
    const dayInteractions = interactions.filter(i => 
      format(new Date(i.createdAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    ).length;
    return {
      date: format(day, 'MMM dd'),
      count: dayInteractions
    };
  });

  // Interaction types distribution
  const interactionTypes = interactions.reduce((acc, interaction) => {
    acc[interaction.type] = (acc[interaction.type] || 0) + 1;
    return acc;
  }, {});

  // Tags distribution
  const tagDistribution = contacts.reduce((acc, contact) => {
    contact.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  // Chart options
  const lineChartOption = {
    title: {
      text: 'Daily Interactions (Last 30 Days)',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    xAxis: {
      type: 'category',
      data: dailyInteractions.map(d => d.date),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [{
      data: dailyInteractions.map(d => d.count),
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#0ea5e9'
      },
      areaStyle: {
        color: '#0ea5e9',
        opacity: 0.3
      }
    }],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    }
  };

  const pieChartOption = {
    title: {
      text: 'Interaction Types',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      bottom: 'bottom'
    },
    series: [{
      name: 'Interactions',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: Object.entries(interactionTypes).map(([type, count]) => ({
        value: count,
        name: type.charAt(0).toUpperCase() + type.slice(1)
      })),
      color: ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b']
    }]
  };

  const barChartOption = {
    title: {
      text: 'Contact Tags Distribution',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: Object.keys(tagDistribution),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [{
      data: Object.values(tagDistribution),
      type: 'bar',
      itemStyle: {
        color: '#0ea5e9'
      }
    }],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    }
  };

  const stats = [
    {
      title: 'Total Contacts',
      value: totalContacts,
      icon: FiUsers,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Interactions',
      value: totalInteractions,
      icon: FiMessageSquare,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Contacts',
      value: activeContacts,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'This Month',
      value: interactionsThisMonth,
      icon: FiCalendar,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Insights into your relationship management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${stat.bgColor} p-6 rounded-xl border border-gray-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <ReactECharts
            option={lineChartOption}
            style={{ height: '300px' }}
            opts={{ renderer: 'svg' }}
          />
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <ReactECharts
            option={pieChartOption}
            style={{ height: '300px' }}
            opts={{ renderer: 'svg' }}
          />
        </motion.div>
      </div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <ReactECharts
          option={barChartOption}
          style={{ height: '300px' }}
          opts={{ renderer: 'svg' }}
        />
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Engagement Rate</h3>
            <p className="text-sm text-blue-700">
              {totalContacts > 0 ? Math.round((activeContacts / totalContacts) * 100) : 0}% of your contacts are active
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">Average Interactions</h3>
            <p className="text-sm text-green-700">
              {totalContacts > 0 ? Math.round(totalInteractions / totalContacts * 10) / 10 : 0} per contact
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-purple-900 mb-2">Most Popular Tag</h3>
            <p className="text-sm text-purple-700">
              {Object.keys(tagDistribution).length > 0 
                ? Object.entries(tagDistribution).sort(([,a], [,b]) => b - a)[0][0]
                : 'No tags yet'
              }
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;