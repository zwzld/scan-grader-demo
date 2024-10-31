import React, { useState, useRef, useEffect } from 'react';

const ScanGraderDemo = () => {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState([]);

  // 示例答案数据 - 实际使用时应该使用完整数据
  const answers = {
    "声声慢": [
      ["寻寻觅觅", "冷冷清清", "凄凄惨惨戚戚"],
      ["乍暖还寒", "时候最难将息"]
    ],
    "归园田居": [
      ["少无适俗韵", "性本爱丘山"],
      ["羁鸟恋旧林", "池鱼思故渊"]
    ]
  };

  useEffect(() => {
    if (isScanning) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isScanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('请确保允许使用摄像头并使用 HTTPS 或 localhost');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleScan = async () => {
    // 模拟识别过程
    const mockResult = {
      poem: "声声慢",
      recognized: "寻寻觅觅",
      isCorrect: true,
      time: new Date().toLocaleTimeString()
    };

    setResults(prev => [mockResult, ...prev]);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-100">
      {/* 扫描区域 */}
      <div className="flex-1 relative bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* 扫描框 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      border-2 border-blue-500 w-4/5 h-32 rounded-lg">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500" />
        </div>

        {/* 控制按钮 */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
          <button
            onClick={() => setIsScanning(!isScanning)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
          >
            {isScanning ? '停止扫描' : '开始扫描'}
          </button>
          
          <button
            onClick={handleScan}
            disabled={!isScanning}
            className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
          >
            识别批改
          </button>
        </div>
      </div>

      {/* 结果显示区域 */}
      <div className="w-full md:w-96 bg-white shadow-lg overflow-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">批改结果</h2>
          <p className="text-sm text-gray-500">
            已批改: {results.length} 题
          </p>
        </div>

        <div className="p-4 space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                result.isCorrect ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{result.poem}</span>
                <span className="text-sm text-gray-500">{result.time}</span>
              </div>
              <div className="mt-2">
                <p>识别文字: {result.recognized}</p>
                <p className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                  {result.isCorrect ? '✓ 正确' : '× 错误'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 使用说明 */}
        <div className="p-4 bg-gray-50 border-t mt-auto">
          <h3 className="font-medium mb-2">使用说明</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>1. 点击"开始扫描"启动相机</li>
            <li>2. 将默写内容对准蓝色框</li>
            <li>3. 点击"识别批改"进行批改</li>
            <li>4. 查看右侧批改结果</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScanGraderDemo;