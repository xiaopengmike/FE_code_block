export default
[
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
        text: '过去一周',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          end.setTime(end.setHours(0,0,0,0) - 3600 * 1000 * 24);
          start.setTime(start.setHours(0,0,0,0) - 3600 * 1000 * 24 * 7);
          picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '过去一个月',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          end.setTime(end.setHours(0,0,0,0) - 3600 * 1000 * 24);
          start.setTime(start.setHours(0,0,0,0) - 3600 * 1000 * 24 * 30);
          picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '过去三个月',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          end.setTime(end.setHours(0,0,0,0) - 3600 * 1000 * 24);
          start.setTime(start.setHours(0,0,0,0) - 3600 * 1000 * 24 * 90);
          picker.$emit('pick', [start, end]);
        }
    },
    {
        text: '过去一年',
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          end.setTime(end.setHours(0,0,0,0) - 3600 * 1000 * 24);
          start.setTime(start.setHours(0,0,0,0) - 3600 * 1000 * 24 * 365);
          picker.$emit('pick', [start, end]);
        }
    }
]