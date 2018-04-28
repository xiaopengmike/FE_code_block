export default
[
	{
		text: '今天',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.setHours(0,0,0,0));
          end.setTime(end.getTime());
          picker.$emit('pick', [start, end]);
        }
	},
	{
        text: '昨天',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.setHours(0,0,0,0) - 3600 * 1000 * 24);
          end.setTime(end.setHours(23,59,59,0) - 3600 * 1000 * 24);
          picker.$emit('pick', [start, end]);
        }
	},
	{
        text: '最近一周',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.setHours(0,0,0,0) - 3600 * 1000 * 24 * 6);
          picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '最近一个月',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.setHours(0,0,0,0) - 3600 * 1000 * 24 * 29);
          picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '最近三个月',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.setHours(0,0,0,0) - 3600 * 1000 * 24 * 89);
          picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '最近一年',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.setHours(0,0,0,0) - 3600 * 1000 * 24 * 365);
          picker.$emit('pick', [start, end]);
        }
    }
]