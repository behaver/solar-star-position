'use strict';

const EarthLocator = require('./Earth');
const PlutoHECC = require('@behaver/pluto99-hecc');
const SolarStarLocator = require('../SolarStarLocator');
const LightTimeEffect = require('../LightTimeEffect');
const { SphericalCoordinate3D } = require('@behaver/coordinate');
const { EclipticCoordinate } = require('@behaver/celestial-coordinate');

/**
 * PlutoLocator
 * 
 * 冥王星坐标计算组件
 *
 * @author 董 三碗 <qianxing@yeah.net>
 */
class PlutoLocator extends SolarStarLocator {

  /**
   * 构造函数
   * 
   * @param {Boolean} options 定位参数项
   */
  constructor(options = {}) {
    super();

    // 初始化参数
    this.private.id = 'pluto';

    // 构造冥王星 J2000 日心黄经坐标计算对象
    this.Calculator = new PlutoHECC;

    // 构造原点位置提供函数
    let opp = (function () {
      let EP = new EarthLocator({
        time: this.Calculator.obTime,
      });
      let earthCoord = EP.get().coord;

      // 转换地球坐标至 J2000 坐标系
      earthCoord.onJ2000();

      return earthCoord;
    }).bind(this);

    // 构造光行时计算对象
    this.LightTimeEffect = new LightTimeEffect({
      originPositionProvider: opp(),
      planetPositionProvider: new PlutoHECC,
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

    let sc = (withLTE) ? this.LightTimeEffect.calc().sc : this.Calculator.rc.toSC();

    sc = new SphericalCoordinate3D(sc.r, sc.theta, sc.phi);

    let coord = new EclipticCoordinate({
      sc,
      centerMode: 'heliocentric',
      withNutation: false,
    });

    coord.onEpoch(this.time);

    return {
      id: this.id,
      time: this.time,
      coord,
      withLTE,
    };
  }
}

module.exports = PlutoLocator;
