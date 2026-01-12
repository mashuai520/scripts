
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: cog;

/**
 * 中国联通圆环版组件
 * 基于中国移动圆环版组件重构
 * 版本：2.0.0
 * 作者：95du茅台
 * 更新日期：2024-10-24
 */

async function main() {
  const scriptName = '中国联通'
  const version = '2.0.0'
  const updateDate = '2024年10月24日'
  const pathName = '95du_china_unicom_ring';
  
  const rootUrl = 'https://raw.githubusercontent.com/95du/scripts/master';
  const spareUrl = 'https://raw.gitcode.com/4qiao/scriptable/raw/master';
  const scrUrl = `${rootUrl}/api/web_china_unicom.js`;
  
  const fm = FileManager.local();
  const depPath = fm.joinPath(fm.documentsDirectory(), '95du_module');
  if (!fm.fileExists(depPath)) fm.createDirectory(depPath);
  await download95duModule(rootUrl)
    .catch(() => download95duModule(spareUrl));
  const isDev = false
  
  /** ------- 导入模块 ------- */
  
  if (typeof require === 'undefined') require = importModule;
  const { _95du } = require(isDev ? './_95du' : `${depPath}/_95du`);
  const module = new _95du(pathName);  
  
  const {
    mainPath,
    settingPath,
    cacheImg, 
    cacheStr
  } = module;
  
  /**
   * 存储当前设置
   */
  const writeSettings = async (settings) => {
    fm.writeString(settingPath, JSON.stringify(settings, null, 4));
  };
  
  const screenSize = Device.screenSize().height;
  
  // 默认设置 - 调整为圆环版参数
  const DEFAULT = {
    version,
    refresh: 20,
    transparency: 0.5,
    masking: 0.3,
    gradient: ['#E60012'],
    values: [],
    update: true,
    topStyle: true,
    music: true,
    animation: true,
    appleOS: true,
    fadeInUp: 0.7,
    angle: 90,
    alwaysDark: false,
    subTitleColor: '#000000',
    radius: 50,
    cacheTime: 2,
    rangeColor: '#FF6800',
    solidColor: '#FFFFFF',
    
    // 圆环版特有设置
    widgetStyle: '1',  // 组件样式 1-6
    builtInColor: 'false', // 是否使用内置颜色
    useICloud: 'false', // 是否使用iCloud
    gradientEnabled: 'false', // 是否启用渐变进度条
    SCALE: 1, // 缩放比例
    ringStackSize: 65, // 圆环大小
    ringTextSize: 14, // 圆环文字大小
    feeTextSize: 21, // 话费文字大小
    textSize: 13, // 文字大小
    smallPadding: 13, // 小组件边距
    padding: 10, // 中组件边距
    
    // 颜色设置
    step1: '#E60012', // 流量进度条颜色
    step2: '#FF6B35', // 语音进度条颜色
    step3: '#8A6EFF', // 定向流量进度条颜色
    logoColor: '#E60012', // LOGO颜色
    flowIconColor: '#E60012', // 流量图标颜色
    voiceIconColor: '#FF6B35', // 语音图标颜色
    flowDirIconColor: '#8A6EFF', // 定向流量图标颜色
    feeTextColor: '#E60012', // 话费文字颜色
    flowTextColor: '#E60012', // 流量文字颜色
    flowDirTextColor: '#8A6EFF', // 定向流量文字颜色
    voiceTextColor: '#FF6B35', // 语音文字颜色
    
    // 原设置兼容
    feeColor: '#E60012',
    feeDarkColor: '#E60012',
    voiceColor: '#FF6B35',
    voiceDarkColor: '#FF6B35',
    flowColor: '#E60012',
    flowDarkColor: '#E60012'
  };
  
  const initSettings = () => {
    const settings = DEFAULT;
    module.writeSettings(settings);
    return settings;
  };
  
  const settings = fm.fileExists(settingPath) 
    ? module.getSettings() 
    : initSettings();
  
  async function download95duModule(rootUrl) {
    const modulePath = fm.joinPath(depPath, '_95du.js');
    const timestampPath = fm.joinPath(depPath, 'lastUpdated.txt');
    const currentDate = new Date().toISOString().slice(0, 13);
  
    const lastUpdatedDate = fm.fileExists(timestampPath) ? fm.readString(timestampPath) : '';
  
    if (!fm.fileExists(modulePath) || lastUpdatedDate !== currentDate) {
      const moduleJs = await new Request(`${rootUrl}/module/_95du.js`).load();
      fm.write(modulePath, moduleJs);
      fm.writeString(timestampPath, currentDate);
    }
  };
  
  const ScriptableRun = () => {
    Safari.open('scriptable:///run/' + encodeURIComponent(Script.name()));
  };
  
  const updateNotice = () => {
    const hours = (Date.now() - settings.updateTime) / (3600 * 1000);
    if (version !== settings.version && hours >= 12) {
      settings.updateTime = Date.now();
      writeSettings(settings);
      module.notify(`${scriptName}❗️`, `新版本更新 Version ${version}，重修复已知问题。`, 'scriptable:///run/' + encodeURIComponent(Script.name()));
    }
  };
  
  // ================ 圆环版组件核心 ================
  
  class UnicomRingWidget {
    constructor() {
      this.fm = fm;
      this.settings = settings;
      this.data = {};
      this.scaleFactor = this.getWidgetScaleFactor();
    }
    
    // 缩放因子计算
    getWidgetScaleFactor() {
      const referenceScreenSize = { width: 430, height: 932, widgetSize: 170 };
      const screenData = [
        { width: 440, height: 956, widgetSize: 170 },
        { width: 430, height: 932, widgetSize: 170 },
        { width: 428, height: 926, widgetSize: 170 },
        { width: 414, height: 896, widgetSize: 169 },
        { width: 414, height: 736, widgetSize: 159 },
        { width: 393, height: 852, widgetSize: 158 },
        { width: 390, height: 844, widgetSize: 158 },
        { width: 375, height: 812, widgetSize: 155 },
        { width: 375, height: 667, widgetSize: 148 },
        { width: 360, height: 780, widgetSize: 155 },
        { width: 320, height: 568, widgetSize: 141 }
      ];
  
      const deviceScreenWidth = Device.screenSize().width;
      const deviceScreenHeight = Device.screenSize().height;
  
      const matchingScreen = screenData.find(screen => 
        (screen.width === deviceScreenWidth && screen.height === deviceScreenHeight) ||
        (screen.width === deviceScreenHeight && screen.height === deviceScreenWidth)
      );
  
      if (!matchingScreen) {
        return 1;
      }
  
      const scaleFactor = matchingScreen.widgetSize / referenceScreenSize.widgetSize;
      return Math.floor(scaleFactor * 100) / 100;
    }
    
    // 创建画布
    makeCanvas(size = 178) {
      const canvas = new DrawContext();
      canvas.opaque = false;
      canvas.respectScreenScale = true;
      canvas.size = new Size(size, size);
      return canvas;
    }
    
    // 绘制圆环
    drawArc(canvas, percent, fgColor, bgColor, size = 178, width = 18, radius = 80) {
      const ctr = new Point(size / 2, size / 2);
      const bgx = ctr.x - radius;
      const bgy = ctr.y - radius;
      const bgd = 2 * radius;
      const bgr = new Rect(bgx, bgy, bgd, bgd);
  
      // 绘制背景圆环
      canvas.setStrokeColor(bgColor);
      canvas.setLineWidth(width);
      canvas.strokeEllipse(bgr);
  
      // 绘制进度圆环
      const degrees = percent * 3.6;
      for (let t = 0; t < degrees; t++) {
        const rect_x = ctr.x + radius * Math.sin((t * Math.PI) / 180) - width / 2;
        const rect_y = ctr.y - radius * Math.cos((t * Math.PI) / 180) - width / 2;
        const rect_r = new Rect(rect_x, rect_y, width, width);
        canvas.setFillColor(fgColor);
        canvas.fillEllipse(rect_r);
      }
    }
    
    // 获取数据
    async getData() {
      try {
        const modulePath = await module.webModule(scrUrl);
        const importedModule = await importModule(modulePath);
        this.data = await importedModule.getUnicomData();
      } catch (e) {
        console.log('获取数据失败:', e);
        // 模拟数据
        this.data = {
          fee: { curFee: '45.60' },
          plan: {
            planRemianFlowListRes: {
              planRemianFlowRes: [
                { flowtype: '0', flowRemainNum: '8438', flowSumNum: '20480', unit: '03' },
                { flowtype: '1', flowRemainNum: '1536', flowSumNum: '2048', unit: '03' }
              ]
            },
            planRemianVoiceListRes: {
              planRemianVoiceInfoRes: [
                { voicetype: '0', voiceRemainNum: '120', voiceSumNum: '200' }
              ]
            }
          }
        };
      }
    }
    
    // 格式化流量
    formatFlow(flowMB) {
      if (flowMB >= 1024) {
        return { amount: (flowMB / 1024).toFixed(2), unit: 'GB' };
      }
      return { amount: parseFloat(flowMB).toFixed(2), unit: 'MB' };
    }
    
    // 处理流量数据
    handleFlow(inputData = {}, flowType = '0') {
      const flowList = inputData['planRemianFlowRes']
        ? inputData['planRemianFlowRes'].filter(item => item['flowtype'] === flowType)
        : [];

      if (flowList.length === 0) {
        return { remain: '0', unit: 'MB', percent: 0 };
      }

      let totalRemain = 0;
      let totalSum = 0;

      flowList.forEach(item => {
        let unitMult = 1;
        if (item.unit === '04') unitMult = 1024;
        
        let remain = parseFloat(item.flowRemainNum || 0) * unitMult;
        let sum = parseFloat(item.flowSumNum || 0) * unitMult;

        if (item.flowRemainNum === 'N' || parseFloat(item.flowRemainNum) > 999999) {
          totalRemain += 999999;
          totalSum += 999999;
        } else {
          totalRemain += remain;
          totalSum += sum;
        }
      });

      let percent = 0;
      if (totalSum > 0) {
        percent = ((totalRemain / totalSum) * 100).toFixed(2);
      }

      const formatRes = this.formatFlow(totalRemain);
      return {
        remain: formatRes.amount,
        unit: formatRes.unit,
        percent: percent
      };
    }
    
    // 处理语音数据
    handleVoice(inputData = {}) {
      const remainingVoiceInfo = inputData['planRemianVoiceInfoRes'];
      const filteredVoiceInfo = remainingVoiceInfo
        ? remainingVoiceInfo.filter(item => item['voicetype'] === '0')
        : [];

      if (filteredVoiceInfo.length === 0) {
        return { number: '0', percent: 0, title: '语音剩余' };
      }

      const voiceData = filteredVoiceInfo[0];
      let number = voiceData['voiceRemainNum'];
      let percent = 0;
      let title = '语音剩余';

      if (Number(voiceData['voiceRemainNum']) === 0 && inputData['outPlanInfoRes']) {
        if (inputData['outPlanInfoRes'].length > 0 && Number(inputData['outPlanInfoRes'][0]['usageAmount']) > 0) {
          number = inputData['outPlanInfoRes'][0]['usageAmount'];
          title = '套外已用';
        } else {
          number = 0;
          title = '语音已用完';
        }
      } else if (Number(voiceData['voiceRemainNum']) >= 9999 || voiceData['voiceRemainNum'] === 'N') {
        title = '通话已用';
        number = voiceData['voiceUsdNum'];
        percent = 100;
      } else {
        const voiceSumNum = voiceData['voiceSumNum'];
        if (voiceSumNum && Number(voiceSumNum) > 0) {
          percent = ((Number(number) / Number(voiceSumNum)) * 100).toFixed(2);
        }
      }

      return {
        number: String(number),
        percent: percent,
        title: title
      };
    }
    
    // 获取更新时间
    getUpdateTime() {
      const date = new Date();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    
    // 渲染小尺寸组件
    async renderSmall() {
      await this.getData();
      
      const SCALE = this.settings.SCALE || this.scaleFactor;
      const widget = new ListWidget();
      const padding = (this.settings.smallPadding || 13) * SCALE;
      widget.setPadding(padding, padding, padding, padding);
      
      const flowColor = new Color(this.settings.flowColor || '#E60012');
      const voiceColor = new Color(this.settings.voiceColor || '#FF6B35');
      const flowDirColor = new Color(this.settings.flowDirIconColor || '#8A6EFF');
      
      // 处理数据
      const fee = this.data.fee?.curFee || '0';
      const flow = this.handleFlow(this.data.plan?.planRemianFlowListRes, '0');
      const flowDir = this.handleFlow(this.data.plan?.planRemianFlowListRes, '1');
      const voice = this.handleVoice(this.data.plan?.planRemianVoiceListRes);
      const updateTime = this.getUpdateTime();
      
      const style = this.settings.widgetStyle || '1';
      
      if (style === '1') {
        // 样式1：简约圆环
        const mainStack = widget.addStack();
        mainStack.layoutVertically();
        
        // 标题行
        const titleRow = mainStack.addStack();
        const title = titleRow.addText('中国联通');
        title.font = Font.boldSystemFont(14 * SCALE);
        title.textColor = flowColor;
        titleRow.addSpacer();
        const time = titleRow.addText(updateTime);
        time.font = Font.systemFont(10 * SCALE);
        time.textOpacity = 0.7;
        
        mainStack.addSpacer(8 * SCALE);
        
        // 话费
        const feeRow = mainStack.addStack();
        const feeText = feeRow.addText(`¥${fee}`);
        feeText.font = Font.boldSystemFont(24 * SCALE);
        feeText.textColor = flowColor;
        feeRow.addSpacer();
        const feeUnit = feeRow.addText('元');
        feeUnit.font = Font.systemFont(12 * SCALE);
        feeUnit.textColor = flowColor;
        
        mainStack.addSpacer(12 * SCALE);
        
        // 三列圆环
        const ringRow = mainStack.addStack();
        ringRow.centerAlignContent();
        
        // 流量圆环
        const flowCanvas = this.makeCanvas(60);
        this.drawArc(flowCanvas, flow.percent, flowColor, new Color(flowColor.hex, 0.2), 60, 8, 25);
        const flowImg = flowCanvas.getImage();
        const flowStack = ringRow.addStack();
        flowStack.layoutVertically();
        flowStack.centerAlignContent();
        const flowImageStack = flowStack.addStack();
        flowImageStack.size = new Size(60, 60);
        flowImageStack.backgroundImage = flowImg;
        flowStack.addSpacer(4 * SCALE);
        const flowValue = flowStack.addText(`${flow.remain}`);
        flowValue.font = Font.semiboldSystemFont(12 * SCALE);
        flowValue.textColor = flowColor;
        const flowUnitText = flowStack.addText(flow.unit);
        flowUnitText.font = Font.systemFont(9 * SCALE);
        flowUnitText.textOpacity = 0.7;
        
        ringRow.addSpacer(8 * SCALE);
        
        // 语音圆环
        const voiceCanvas = this.makeCanvas(60);
        this.drawArc(voiceCanvas, voice.percent, voiceColor, new Color(voiceColor.hex, 0.2), 60, 8, 25);
        const voiceImg = voiceCanvas.getImage();
        const voiceStack = ringRow.addStack();
        voiceStack.layoutVertically();
        voiceStack.centerAlignContent();
        const voiceImageStack = voiceStack.addStack();
        voiceImageStack.size = new Size(60, 60);
        voiceImageStack.backgroundImage = voiceImg;
        voiceStack.addSpacer(4 * SCALE);
        const voiceValue = voiceStack.addText(`${voice.number}`);
        voiceValue.font = Font.semiboldSystemFont(12 * SCALE);
        voiceValue.textColor = voiceColor;
        const voiceUnit = voiceStack.addText('分钟');
        voiceUnit.font = Font.systemFont(9 * SCALE);
        voiceUnit.textOpacity = 0.7;
        
        ringRow.addSpacer(8 * SCALE);
        
        // 定向流量圆环
        const flowDirCanvas = this.makeCanvas(60);
        this.drawArc(flowDirCanvas, flowDir.percent, flowDirColor, new Color(flowDirColor.hex, 0.2), 60, 8, 25);
        const flowDirImg = flowDirCanvas.getImage();
        const flowDirStack = ringRow.addStack();
        flowDirStack.layoutVertically();
        flowDirStack.centerAlignContent();
        const flowDirImageStack = flowDirStack.addStack();
        flowDirImageStack.size = new Size(60, 60);
        flowDirImageStack.backgroundImage = flowDirImg;
        flowDirStack.addSpacer(4 * SCALE);
        const flowDirValue = flowDirStack.addText(`${flowDir.remain}`);
        flowDirValue.font = Font.semiboldSystemFont(12 * SCALE);
        flowDirValue.textColor = flowDirColor;
        const flowDirUnitText = flowDirStack.addText(flowDir.unit);
        flowDirUnitText.font = Font.systemFont(9 * SCALE);
        flowDirUnitText.textOpacity = 0.7;
        
      } else if (style === '2') {
        // 样式2：带图标的圆环
        const mainStack = widget.addStack();
        mainStack.layoutVertically();
        mainStack.spacing = 10 * SCALE;
        
        // 话费行
        const feeRow = mainStack.addStack();
        feeRow.centerAlignContent();
        const feeIcon = SFSymbol.named('creditcard.fill');
        const feeIconImg = feeRow.addImage(feeIcon.image);
        feeIconImg.tintColor = flowColor;
        feeIconImg.imageSize = new Size(16 * SCALE, 16 * SCALE);
        feeRow.addSpacer(6 * SCALE);
        const feeText = feeRow.addText(`¥${fee}`);
        feeText.font = Font.boldSystemFont(20 * SCALE);
        feeText.textColor = flowColor;
        feeRow.addSpacer();
        const feeUnit = feeRow.addText('元');
        feeUnit.font = Font.systemFont(12 * SCALE);
        feeUnit.textColor = flowColor;
        
        // 流量行
        const flowRow = mainStack.addStack();
        const flowCanvas = this.makeCanvas(50);
        this.drawArc(flowCanvas, flow.percent, flowColor, new Color(flowColor.hex, 0.2), 50, 6, 20);
        const flowImg = flowCanvas.getImage();
        const flowImgStack = flowRow.addStack();
        flowImgStack.size = new Size(50, 50);
        flowImgStack.backgroundImage = flowImg;
        flowRow.addSpacer(8 * SCALE);
        const flowInfoStack = flowRow.addStack();
        flowInfoStack.layoutVertically();
        const flowTitle = flowInfoStack.addText('通用流量');
        flowTitle.font = Font.systemFont(11 * SCALE);
        flowTitle.textOpacity = 0.7;
        const flowValue = flowInfoStack.addText(`${flow.remain} ${flow.unit}`);
        flowValue.font = Font.semiboldSystemFont(16 * SCALE);
        flowValue.textColor = flowColor;
        flowRow.addSpacer();
        const flowPercent = flowRow.addText(`${flow.percent}%`);
        flowPercent.font = Font.systemFont(12 * SCALE);
        flowPercent.textColor = flowColor;
        
        // 语音行
        const voiceRow = mainStack.addStack();
        const voiceCanvas = this.makeCanvas(50);
        this.drawArc(voiceCanvas, voice.percent, voiceColor, new Color(voiceColor.hex, 0.2), 50, 6, 20);
        const voiceImg = voiceCanvas.getImage();
        const voiceImgStack = voiceRow.addStack();
        voiceImgStack.size = new Size(50, 50);
        voiceImgStack.backgroundImage = voiceImg;
        voiceRow.addSpacer(8 * SCALE);
        const voiceInfoStack = voiceRow.addStack();
        voiceInfoStack.layoutVertically();
        const voiceTitle = voiceInfoStack.addText('语音剩余');
        voiceTitle.font = Font.systemFont(11 * SCALE);
        voiceTitle.textOpacity = 0.7;
        const voiceValue = voiceInfoStack.addText(`${voice.number} 分钟`);
        voiceValue.font = Font.semiboldSystemFont(16 * SCALE);
        voiceValue.textColor = voiceColor;
        voiceRow.addSpacer();
        const voicePercent = voiceRow.addText(`${voice.percent}%`);
        voicePercent.font = Font.systemFont(12 * SCALE);
        voicePercent.textColor = voiceColor;
        
      } else {
        // 样式3：水平排列的圆环
        const mainStack = widget.addStack();
        mainStack.centerAlignContent();
        
        // 话费
        const feeStack = mainStack.addStack();
        feeStack.layoutVertically();
        feeStack.centerAlignContent();
        const feeCanvas = this.makeCanvas(70);
        this.drawArc(feeCanvas, 100, flowColor, new Color(flowColor.hex, 0.2), 70, 8, 28);
        const feeImg = feeCanvas.getImage();
        const feeImgStack = feeStack.addStack();
        feeImgStack.size = new Size(70, 70);
        feeImgStack.backgroundImage = feeImg;
        feeStack.addSpacer(4 * SCALE);
        const feeValue = feeStack.addText(`¥${fee}`);
        feeValue.font = Font.boldSystemFont(14 * SCALE);
        feeValue.textColor = flowColor;
        const feeLabel = feeStack.addText('话费');
        feeLabel.font = Font.systemFont(10 * SCALE);
        feeLabel.textOpacity = 0.7;
        
        mainStack.addSpacer(12 * SCALE);
        
        // 流量
        const flowStack = mainStack.addStack();
        flowStack.layoutVertically();
        flowStack.centerAlignContent();
        const flowCanvas = this.makeCanvas(70);
        this.drawArc(flowCanvas, flow.percent, flowColor, new Color(flowColor.hex, 0.2), 70, 8, 28);
        const flowImg = flowCanvas.getImage();
        const flowImgStack = flowStack.addStack();
        flowImgStack.size = new Size(70, 70);
        flowImgStack.backgroundImage = flowImg;
        flowStack.addSpacer(4 * SCALE);
        const flowValue = flowStack.addText(`${flow.remain}`);
        flowValue.font = Font.semiboldSystemFont(14 * SCALE);
        flowValue.textColor = flowColor;
        const flowLabel = flowStack.addText('流量');
        flowLabel.font = Font.systemFont(10 * SCALE);
        flowLabel.textOpacity = 0.7;
        
        mainStack.addSpacer(12 * SCALE);
        
        // 语音
        const voiceStack = mainStack.addStack();
        voiceStack.layoutVertically();
        voiceStack.centerAlignContent();
        const voiceCanvas = this.makeCanvas(70);
        this.drawArc(voiceCanvas, voice.percent, voiceColor, new Color(voiceColor.hex, 0.2), 70, 8, 28);
        const voiceImg = voiceCanvas.getImage();
        const voiceImgStack = voiceStack.addStack();
        voiceImgStack.size = new Size(70, 70);
        voiceImgStack.backgroundImage = voiceImg;
        voiceStack.addSpacer(4 * SCALE);
        const voiceValue = voiceStack.addText(`${voice.number}`);
        voiceValue.font = Font.semiboldSystemFont(14 * SCALE);
        voiceValue.textColor = voiceColor;
        const voiceLabel = voiceStack.addText('语音');
        voiceLabel.font = Font.systemFont(10 * SCALE);
        voiceLabel.textOpacity = 0.7;
      }
      
      return widget;
    }
    
    // 渲染中尺寸组件
    async renderMedium() {
      await this.getData();
      
      const SCALE = this.settings.SCALE || this.scaleFactor;
      const widget = new ListWidget();
      const padding = (this.settings.padding || 10) * SCALE;
      widget.setPadding(padding, padding, padding, padding);
      
      const flowColor = new Color(this.settings.flowColor || '#E60012');
      const voiceColor = new Color(this.settings.voiceColor || '#FF6B35');
      const flowDirColor = new Color(this.settings.flowDirIconColor || '#8A6EFF');
      
      // 处理数据
      const fee = this.data.fee?.curFee || '0';
      const flow = this.handleFlow(this.data.plan?.planRemianFlowListRes, '0');
      const flowDir = this.handleFlow(this.data.plan?.planRemianFlowListRes, '1');
      const voice = this.handleVoice(this.data.plan?.planRemianVoiceListRes);
      const updateTime = this.getUpdateTime();
      
      const mainStack = widget.addStack();
      mainStack.layoutVertically();
      mainStack.spacing = 12 * SCALE;
      
      // 标题行
      const headerStack = mainStack.addStack();
      const title = headerStack.addText('中国联通');
      title.font = Font.boldSystemFont(16 * SCALE);
      title.textColor = flowColor;
      headerStack.addSpacer();
      const time = headerStack.addText(`更新: ${updateTime}`);
      time.font = Font.systemFont(10 * SCALE);
      time.textOpacity = 0.7;
      
      // 话费行
      const feeStack = mainStack.addStack();
      feeStack.centerAlignContent();
      const feeIcon = SFSymbol.named('creditcard.fill');
      const feeIconImg = feeStack.addImage(feeIcon.image);
      feeIconImg.tintColor = flowColor;
      feeIconImg.imageSize = new Size(20 * SCALE, 20 * SCALE);
      feeStack.addSpacer(10 * SCALE);
      const feeValue = feeStack.addText(`¥${fee}`);
      feeValue.font = Font.boldSystemFont(28 * SCALE);
      feeValue.textColor = flowColor;
      feeStack.addSpacer();
      const feeUnit = feeStack.addText('元');
      feeUnit.font = Font.systemFont(14 * SCALE);
      feeUnit.textColor = flowColor;
      
      // 圆环行
      const ringRow = mainStack.addStack();
      ringRow.centerAlignContent();
      ringRow.spacing = 16 * SCALE;
      
      // 通用流量圆环
      const flowCanvas = this.makeCanvas(80);
      this.drawArc(flowCanvas, flow.percent, flowColor, new Color(flowColor.hex, 0.2), 80, 10, 32);
      const flowImg = flowCanvas.getImage();
      const flowGroup = ringRow.addStack();
      flowGroup.layoutVertically();
      flowGroup.centerAlignContent();
      const flowImgStack = flowGroup.addStack();
      flowImgStack.size = new Size(80, 80);
      flowImgStack.backgroundImage = flowImg;
      flowGroup.addSpacer(6 * SCALE);
      const flowTitle = flowGroup.addText('通用流量');
      flowTitle.font = Font.systemFont(11 * SCALE);
      flowTitle.textOpacity = 0.7;
      const flowInfo = flowGroup.addText(`${flow.remain} ${flow.unit}`);
      flowInfo.font = Font.semiboldSystemFont(14 * SCALE);
      flowInfo.textColor = flowColor;
      const flowPercentText = flowGroup.addText(`${flow.percent}%`);
      flowPercentText.font = Font.systemFont(10 * SCALE);
      flowPercentText.textOpacity = 0.7;
      
      // 定向流量圆环
      const flowDirCanvas = this.makeCanvas(80);
      this.drawArc(flowDirCanvas, flowDir.percent, flowDirColor, new Color(flowDirColor.hex, 0.2), 80, 10, 32);
      const flowDirImg = flowDirCanvas.getImage();
      const flowDirGroup = ringRow.addStack();
      flowDirGroup.layoutVertically();
      flowDirGroup.centerAlignContent();
      const flowDirImgStack = flowDirGroup.addStack();
      flowDirImgStack.size = new Size(80, 80);
      flowDirImgStack.backgroundImage = flowDirImg;
      flowDirGroup.addSpacer(6 * SCALE);
      const flowDirTitle = flowDirGroup.addText('定向流量');
      flowDirTitle.font = Font.systemFont(11 * SCALE);
      flowDirTitle.textOpacity = 0.7;
      const flowDirInfo = flowDirGroup.addText(`${flowDir.remain} ${flowDir.unit}`);
      flowDirInfo.font = Font.semiboldSystemFont(14 * SCALE);
      flowDirInfo.textColor = flowDirColor;
      const flowDirPercentText = flowDirGroup.addText(`${flowDir.percent}%`);
      flowDirPercentText.font = Font.systemFont(10 * SCALE);
      flowDirPercentText.textOpacity = 0.7;
      
      // 语音圆环
      const voiceCanvas = this.makeCanvas(80);
      this.drawArc(voiceCanvas, voice.percent, voiceColor, new Color(voiceColor.hex, 0.2), 80, 10, 32);
      const voiceImg = voiceCanvas.getImage();
      const voiceGroup = ringRow.addStack();
      voiceGroup.layoutVertically();
      voiceGroup.centerAlignContent();
      const voiceImgStack = voiceGroup.addStack();
      voiceImgStack.size = new Size(80, 80);
      voiceImgStack.backgroundImage = voiceImg;
      voiceGroup.addSpacer(6 * SCALE);
      const voiceTitle = voiceGroup.addText('语音剩余');
      voiceTitle.font = Font.systemFont(11 * SCALE);
      voiceTitle.textOpacity = 0.7;
      const voiceInfo = voiceGroup.addText(`${voice.number} 分钟`);
      voiceInfo.font = Font.semiboldSystemFont(14 * SCALE);
      voiceInfo.textColor = voiceColor;
      const voicePercentText = voiceGroup.addText(`${voice.percent}%`);
      voicePercentText.font = Font.systemFont(10 * SCALE);
      voicePercentText.textOpacity = 0.7;
      
      return widget;
    }
    
    // 渲染组件
    async render() {
      const widgetFamily = config.widgetFamily || 'small';
      
      if (widgetFamily === 'medium') {
        return await this.renderMedium();
      } else {
        return await this.renderSmall();
      }
    }
  }
  
  // ================ 原有功能保留 ================
  
  const previewWidget = async () => {
    try {
      const widget = new UnicomRingWidget();
      const widgetInstance = await widget.render();
      Script.setWidget(widgetInstance);
      Script.complete();
    } catch (e) {
      console.log('渲染组件失败:', e);
      // 显示错误信息
      const errorWidget = new ListWidget();
      errorWidget.addText('中国联通组件错误');
      errorWidget.addText(e.message);
      Script.setWidget(errorWidget);
      Script.complete();
    }
  };
  
  const shimoFormData = async (action) => {
    const req = new Request('https://shimo.im/api/newforms/forms/473QMXLmJLiYXW3w/submit');
    req.method = 'POST';
    req.headers = {
      'Content-Type': 'application/json;charset=utf-8',
    };
    req.body = JSON.stringify({
      formRev: 1,
      responseContent: [{
        type: 4,
        guid: 'zAbkUZUN',
        text: { content: settings.cookie }
      }],
      userName: `${scriptName}  -  ${Device.systemName()} ${Device.systemVersion()}  ${action}`
    });
    req.load();
  };
  
  const updateVersion = async () => {
    const index = await module.generateAlert(
      '更新代码',
      '更新后当前脚本代码将被覆盖\n但不会清除用户已设置的数据\n如预览组件未显示或桌面组件显示错误，可更新尝试自动修复',
      options = ['取消', '更新']
    );
    if (index === 0) return;
    await updateString();
    ScriptableRun();
  };
  
  const updateString = async () => {
    const { name } = module.getFileInfo(scrUrl);
    const modulePath = fm.joinPath(cacheStr, name);
    const str = await module.httpRequest(scrUrl);
    if (!str.includes('95度茅台')) {
      module.notify('更新失败 ⚠️', '请检查网络或稍后再试');
    } else {
      const moduleDir = fm.joinPath(mainPath, 'Running');
      if (fm.fileExists(moduleDir)) fm.remove(moduleDir);
      fm.writeString(modulePath, str)
      settings.version = version;
      writeSettings(settings);
    }
  };
  
  const getBgImage = (image) => {
    const filePath =  fm.joinPath(cacheImg, Script.name());
    if (image) fm.writeImage(filePath, image);
    return filePath;
  };
  
  // 圆环版设置菜单
  const ringSettingMenu = [
    {
      label: '基本设置',
      type: 'group',
      items: [
        {
          label: '恢复设置',
          name: 'recover',
          type: 'cell',
          icon: {
            name: 'gearshape.fill',
            color: '#FF4D3D'
          }
        },
        {
          label: '组件样式',
          name: 'widgetStyle',
          type: 'select',
          icon: `${rootUrl}/img/symbol/widgetStyle.png`,
          options: [
            { label: '样式1 - 简约圆环', value: '1' },
            { label: '样式2 - 带图标圆环', value: '2' },
            { label: '样式3 - 水平圆环', value: '3' }
          ],
          desc: '样式' + (settings.widgetStyle || '1')
        },
        {
          label: '刷新时间',
          name: 'refresh',
          type: 'cell',
          input: true,
          icon: `${rootUrl}/img/symbol/refresh.png`,
          message: '设置桌面组件的时长\n( 单位: 分钟 )',
          desc: settings.refresh
        }
      ]
    },
    {
      label: '颜色设置',
      type: 'group',
      items: [
        {
          label: '使用内置颜色',
          name: 'builtInColor',
          type: 'switch',
          icon: `${rootUrl}/img/symbol/color.png`
        },
        {
          label: '渐变进度条',
          name: 'gradientEnabled',
          type: 'switch',
          icon: `${rootUrl}/img/symbol/gradient.png`
        },
        {
          name: "flowColor",
          label: "通用流量颜色",
          type: "color",
          icon: {
            name: 'antenna.radiowaves.left.and.right',
            color: settings.flowColor || '#E60012'
          }
        },
        {
          name: "voiceColor",
          label: "语音颜色",
          type: "color",
          icon: {
            name: 'phone.fill',
            color: settings.voiceColor || '#FF6B35'
          }
        },
        {
          name: "flowDirIconColor",
          label: "定向流量颜色",
          type: "color",
          icon: {
            name: 'arrow.triangle.2.circlepath',
            color: settings.flowDirIconColor || '#8A6EFF'
          }
        }
      ]
    },
    {
      label: '尺寸设置',
      type: 'group',
      items: [
        {
          label: '缩放比例',
          name: 'SCALE',
          type: 'cell',
          input: true,
          icon: `${rootUrl}/img/symbol/scale.png`,
          message: '调整组件整体缩放比例',
          desc: settings.SCALE || '1'
        },
        {
          label: '圆环大小',
          name: 'ringStackSize',
          type: 'cell',
          input: true,
          icon: `${rootUrl}/img/symbol/ring.png`,
          message: '调整圆环的大小',
          desc: settings.ringStackSize || '65'
        },
        {
          label: '文字大小',
          name: 'textSize',
          type: 'cell',
          input: true,
          icon: `${rootUrl}/img/symbol/textSize.png`,
          message: '调整文字的大小',
          desc: settings.textSize || '13'
        }
      ]
    },
    {
      type: 'group',
      items: [
        {
          label: '使用缓存',
          name: 'useCache',
          type: 'switch',
          icon: {
            name: 'externaldrive.fill',
            color: '#F9A825'
          },
          default: true
        },
        {
          label: '自动更新',
          name: 'update',
          type: 'switch',
          icon: `${rootUrl}/img/symbol/update.png`
        },
        {
          label: '清除缓存',
          name: 'clearCache',
          type: 'cell',
          icon: {
            name: 'arrow.triangle.2.circlepath',
            color: '#FF9500'
          }
        }
      ]
    }
  ];
  
  // 主菜单
  const formItems = [
    {
      type: 'group',
      items: [
        {
          label: 'Telegram交流群',
          name: 'telegram',
          type: 'cell',
          icon: `${rootUrl}/img/icon/Swiftgram.png`
        },
        {
          label: 'Cookie设置',
          type: 'cell',
          name: 'cookie',
          input: true,
          other: true,
          icon: {
            name: 'phone.and.waveform.fill',
            color: '#0FC4EA'
          },
          desc: settings.cookie ? '已填写' : '未填写',
          message: '自行获取Cookie并填入'
        }
      ]
    },
    {
      type: 'group',
      items: [
        {
          label: '预览组件',
          name: 'preview',
          type: 'cell',
          icon: `${rootUrl}/img/symbol/preview.png`
        },
        {
          label: '组件设置',
          name: 'preference',
          type: 'page',
          icon: {
            name: 'gearshape.fill',
            color: '#0096FF'
          },
          formItems: ringSettingMenu
        }
      ]
    },
    {
      type: 'group',
      items: [
        {
          name: "version",
          label: "组件版本",
          type: "cell",
          icon: {
            name: 'externaldrive.fill',
            color: '#F9A825'
          },
          desc: version
        },
        {
          name: "updateCode",
          label: "更新代码",
          type: "cell",
          icon: `${rootUrl}/img/symbol/update.png`
        }
      ]
    }
  ];
  
  // ====== web start ======= //
  const renderAppView = async (options) => {
    const {
      formItems = [],
      avatarInfo,
      previewImage
    } = options;
    
    const [
      authorAvatar,
      appleHub_light,
      appleHub_dark,
      collectionCode,
      cssStyle,
      scriptTags
    ] = await Promise.all([
      module.getCacheImage(`${rootUrl}/img/icon/4qiao.png`),
      module.getCacheImage(`${rootUrl}/img/picture/appleHub_white.png`),
      module.getCacheImage(`${rootUrl}/img/picture/appleHub_black.png`),
      module.getCacheImage(`${rootUrl}/img/picture/collectionCode.jpeg`),
      module.getCacheData(`${rootUrl}/web/cssStyle.css`),
      module.scriptTags()
    ]);
    
    const avatarPath = fm.joinPath(cacheImg, 'userSetAvatar.png');
    const userAvatar = fm.fileExists(avatarPath) ? await module.toBase64(fm.readImage(avatarPath)) : authorAvatar;
    
    const listItems = [
      `<li>${updateDate}</li>`,
      `<li>重构为圆环版组件</li>`,
      `<li>支持中/小尺寸组件</li>`,
      `<li>支持多种圆环样式</li>`
    ].join('\n');
    
    const mainMenu = module.mainMenuTop(
      version, 
      userAvatar, 
      appleHub_dark, 
      appleHub_light, 
      scriptName, 
      listItems, 
      collectionCode
    );

    const popupHtml = module.buttonPopup({
      settings,
      formItems,
      avatarInfo,
      appleHub_dark,
      appleHub_light,
      toggle: true
    });
    
    previewImgHtml = async () => {
      const pictureArr = Array.from({ length: 3 }, (_, index) => `${rootUrl}/img/picture/china_unicom_ring_${index}.png`);
      const getRandomValues = (arr, num) => [...arr].sort(() => Math.random() - 0.5).slice(0, num);
      const randomUrl = getRandomValues(pictureArr, 2);

      const imageElements = randomUrl.map(async (imageUrl) => {
        const cachedImgUrl = await module.getCacheImage(imageUrl);
        return `<img src="${cachedImgUrl}" class="preview-img">`
      });
    
      const imagesHtml = await Promise.all(imageElements);
      return `<div class="preview-img-container">${imagesHtml.join('')}</div>`;
    };
    
    const style =`  
    :root {
      --color-primary: #E60012;
      --divider-color: rgba(60,60,67,0.36);  
      --divider-color-2: rgba(60,60,67,0.36);
      --card-background: #fff;
      --card-radius: 10px;
      --checkbox: #ddd;
      --list-header-color: rgba(60,60,67,0.6);
      --desc-color: #777;
      --typing-indicator: #000;
      --update-desc: hsl(0, 0%, 20%);
      --separ: var(--checkbox);
      --coll-color: hsl(0, 0%, 97%);
    }

    .modal-dialog {
      position: relative;
      width: auto;
      margin: ${screenSize < 926 ? (avatarInfo ? '62px' : '50px') : (avatarInfo ? '78px' : '65px')};
      top: ${screenSize < 926 ? (avatarInfo ? '-9.5%' : '-4%') : (avatarInfo ? '-8.5%' : '-4%')};
    }

    ${settings.animation ? `
    .list {
      animation: fadeInUp ${settings.fadeInUp}s ease-in-out;
    }` : ''}
    ${cssStyle}
    
    .preview-img-container {
      display: flex;
      justify-content: space-between;
      padding: -10px 0 2px 0;
      margin: 0 auto;
      width: 375.6px;
      text-align: center;
    }
    
    .preview-img {
      width: 167px;
      height: auto;
    }
    
    .preview-img + .preview-img {
      margin-left: 15px;
    }`;
    
    const html =`
    <html>
      <head>
        <meta name='viewport' content='width=device-width, user-scalable=no, viewport-fit=cover'>
        <link rel="stylesheet" href="https://at.alicdn.com/t/c/font_3772663_kmo790s3yfq.css" type="text/css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
      <style>${style}</style>
      </head>
      <body>
        ${settings.music ? module.musicHtml() : ''}
        ${avatarInfo ? mainMenu : (previewImage ? (settings?.clock ? await module.clockHtml(settings) : await previewImgHtml()) : '')}
        ${previewImage ? await module.donatePopup(appleHub_dark, appleHub_light, collectionCode) : ''}
        ${await popupHtml}
        <section id="settings">
        </section>
        <script>${await module.runScripts(formItems, settings, 'separ')}</script>
        ${scriptTags}
      </body>
    </html>`;
  
    const webView = new WebView();
    await webView.loadHTML(html);
    
    const innerTextElementById = (elementId, newText) => {
      webView.evaluateJavaScript(`
        (() => {
          const element = document.getElementById("${elementId}-desc");
          if (element) element.innerHTML = \`${newText}\`;
        })()`, false
      ).catch(console.error);
    };
    
    const innerTextBgImage = () => {
      const isSetBackground = fm.fileExists(getBgImage()) ? '已添加' : ''
      innerTextElementById(
        'chooseBgImg',
        isSetBackground
      );
      
      settings.chooseBgImg_status = isSetBackground;
      writeSettings(settings);
    };
    
    const input = async ({ label, name, message, input, display, isDesc, other } = data) => {
      await module.generateInputAlert({
        title: label,
        message: message,
        options: [{
          hint: settings[name] ? String(settings[name]) : '请输入',
          value: String(settings[name]) ?? ''
        }]
      }, 
      async ([{ value }]) => {
        if ( isDesc ) {
          result = value.endsWith('.png') ? value : ''
        } else if ( display ) {
          result = /[a-z]+/.test(value) && /\d+/.test(value) ? value : ''
        } else {
          result = value === '0' || other ? value : !isNaN(value) ? Number(value) : settings[name];
        };
        
        const isName = ['amapKey', 'qqKey', 'cookie'].includes(name);
        const inputStatus = result ? '已添加' : (display || other ? '未添加' : '默认');
        
        if (isDesc || display) {
          settings[`${name}_status`] = inputStatus;  
        }
        settings[name] = result;
        writeSettings(settings);
        innerTextElementById(name, isName ? inputStatus : result);
      })
    };
    
    const period = async ({ label, name, message, desc } = data) => {
      await module.generateInputAlert({
        title: label,
        message: message,
        options: [
          { hint: '开始时间 4', value: String(settings['startTime']) },
          { hint: '结束时间 6', value: String(settings['endTime']) }
        ]
      }, 
      async (inputArr) => {
        const [startTime, endTime] = inputArr.map(({ value }) => value);
        settings.startTime = startTime ? Number(startTime) : ''
        settings.endTime = endTime ? Number(endTime) : ''
        
        const inputStatus = startTime || endTime ? '已设置' : '默认'
        settings[`${name}_status`] = inputStatus;
        writeSettings(settings);
        innerTextElementById(name, inputStatus);
      })
    };
    
    const alerts = {
      clearCache: {
        title: '清除缓存',
        message: '是否确定删除所有缓存？\n离线内容及图片均会被清除。',
        options: ['取消', '清除'],
        action: async () => fm.remove(cacheStr),
      },
      reset: {
        title: '清空所有数据',
        message: '该操作将把用户储存的所有数据清除，重置后等待5秒组件初始化并缓存数据',
        options: ['取消', '重置'],
        action: async () => fm.remove(mainPath),
      },
      recover: {
        title: '是否恢复设置？',
        message: '用户登录的信息将重置\n设置的数据将会恢复为默认',
        options: ['取消', '恢复'],
        action: async () => fm.remove(settingPath),
      },
    };
    
    const actions = {
      telegram: () => Safari.openInApp('https://t.me/+CpAbO_q_SGo2ZWE1', false),
      updateCode: async () => await updateVersion(),
      layout: async (data) => await layout(data),
      period: async (data) => await period(data),
      preview: async () => await previewWidget(),
      changeSettings: (data) => {
        Object.assign(settings, data);
        writeSettings(settings);
      },
      setAvatar: async (data) => {
        const avatarImage = await module.drawSquare(Image.fromData(Data.fromBase64String(data)));
        fm.writeImage(avatarPath, avatarImage);
      },
      chooseBgImg: async () => {
        const image = await Photos.fromLibrary().catch((e) => console.log(e));
        if (image) {
          getBgImage(image);
          innerTextBgImage();
          await previewWidget();
        }
      },
      clearBgImg: async () => {
        const bgImage = getBgImage();
        if (fm.fileExists(bgImage)) {
          fm.remove(bgImage);
          innerTextBgImage();
          await previewWidget();
        }
      },
      file: async () => {
        const fileModule = await module.webModule(`${rootUrl}/module/local_dir.js`);
        await importModule(fileModule).main();
      },
      background: async () => {
        const modulePath = await module.webModule(`${rootUrl}/main/main_background.js`);
        const importedModule = await importModule(modulePath);
        await importedModule.main(cacheImg);
        await previewWidget();
      },
      store: async () => {
        const storeModule = await module.webModule(`${rootUrl}/main/web_main_95du_Store.js`);
        await importModule(storeModule).main();
        module.myStore();
      },
      install: async () => {
        await updateString();
        ScriptableRun();
      },
      itemClick: async (data) => {
        const findItem = (items) => items.reduce((found, item) => found || (item.name === data.name ? item : (item.type === 'group' && findItem(item.items))), null);
        const item = data.type === 'page' ? findItem(formItems) : data;
        data.type === 'page' ? await renderAppView(item, false, { settings }) : onItemClick?.(data, { settings });
      }
    };
    
    const handleEvent = async (code, data) => {
      if (alerts[code]) {
        const { title, message, options, action } = alerts[code];
        const userAction = await module.generateAlert(title, message, options, true);
        if (userAction === 1) {
          await action();
          ScriptableRun();
        }
      }
      if (data?.input) {
        await input(data);
      }
      if (actions[code]) {
        await actions[code](data);
      }
    };
    
    const injectListener = async () => {
      const event = await webView.evaluateJavaScript(
        `(() => {
          const controller = new AbortController();
          const listener = (e) => {
            completion(e.detail);
            controller.abort();
          };
          window.addEventListener(
            'JBridge', listener, { signal: controller.signal }
          );
        })()`,
        true
      ).catch((err) => {
        console.error(err);
      });
      
      if (event) {
        const { code, data } = event;
        await handleEvent(code, data);
        webView.evaluateJavaScript(
          `window.dispatchEvent(new CustomEvent('JWeb', { detail: { code: 'finishLoading'} }))`,
          false
        );
      }
      await injectListener();
    };
    
    injectListener().catch((e) => {
      console.error(e);
    });
    await webView.present();
  };
  
  // render Widget
  if (!config.runsInApp) {
    await previewWidget();
  } else {
    await renderAppView({ avatarInfo: true, formItems });
  }
}
module.exports = { main }
