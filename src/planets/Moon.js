'use strict';

const MoonGECC = require('@behaver/elp2000-moon-gecc');
const { EclipticCoordinate } = require('@behaver/celestial-coordinate');
const SolarStarLocator = require('../SolarStarLocator');
const LightTimeEffect = require('../LightTimeEffect');
const { SphericalCoordinate3D } = require('@behaver/coordinate');

/**
 * MoonLocator
 * 
 * 月球坐标计算组件
 *
 * @author 董 三碗 <qianxing@yeah.net>
 */
class MoonLocator extends SolarStarLocator {

  /**
   * 构造函数
   * 
   * @param {Boolean} options 定位参数项
   */
  constructor(options = {}) {
    super();

    // 初始化参数
    this.private.id = 'moon';

    // 构造月球地心黄经坐标计算对象
    this.Calculator = new MoonGECC;

    // 构造光行时计算对象
    this.LightTimeEffect = new LightTimeEffect({
      originPositionProvider: { 
        sc: new SphericalCoordinate3D(0, 0, 0), 
      },
      planetPositionProvider: new MoonGECC,
    });

    this.options(options);
  }

  /**
   * 获取计算结果
   * 
   * @param  {Object} options 定位参数项
   * 
   * @return {Object}         定位结果集
   */
  get(options = {}) {

    this.options(options);

    let withLTE = this.withLTE;

    let sc = (withLTE) ? this.LightTimeEffect.calc().sc : this.Calculator.sc;

    let coord = new EclipticCoordinate({
      sc,
      centerMode: 'geocentric',
      epoch: this.time,
      withNutation: false,
      enableAnnualAberration: false,
      withAnnualAberration: true,
    });

    return {
      id: this.id,
      time: this.time,
      coord,
      withLTE,
    }
  }
}

module.exports = MoonLocator;
