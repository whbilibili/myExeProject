import numpy_financial as npf

def financial_forecast(
    initial_investment: float,
    initial_annual_sales_units: int,
    price_per_unit: float,
    cost_per_unit: float,
    annual_marketing_expenses: float,
    annual_growth_rate_sales: float,  # 例如：0.10 代表 10%
    discount_rate: float,             # 例如：0.08 代表 8%，用于NPV计算
    simulation_years: int = 5
) -> tuple:
    """
    分析新智能家居系统的5年财务预测。

    参数:
    - initial_investment (float): 初始投资成本
    - initial_annual_sales_units (int): 第一年的预计年销量
    - price_per_unit (float): 产品单价
    - cost_per_unit (float): 单位生产成本
    - annual_marketing_expenses (float): 年度营销费用 (假设固定)
    - annual_growth_rate_sales (float): 销售额年增长率
    - discount_rate (float): 折现率，用于计算NPV
    - simulation_years (int): 预测的年数，默认为5年

    返回:
    - tuple: (yearly_data_list, all_cash_flows, payback_period_str, irr_value, npv_value)
    """
    yearly_data = []
    # 现金流列表：第一个元素是第0年的初始投资 (负数)
    cash_flows = [-initial_investment] 

    current_sales_units = float(initial_annual_sales_units)

    print("\n--- 输入参数 ---")
    print(f"初始投资成本: ${initial_investment:,.2f}")
    print(f"初始年销量: {initial_annual_sales_units:,} 单位")
    print(f"产品单价: ${price_per_unit:,.2f}")
    print(f"单位生产成本: ${cost_per_unit:,.2f}")
    print(f"年度营销费用: ${annual_marketing_expenses:,.2f}")
    print(f"年销量增长率: {annual_growth_rate_sales:.2%}")
    print(f"NPV折现率: {discount_rate:.2%}")
    print(f"预测年限: {simulation_years} 年")
    print("------------------------\n")

    print("--- 逐年财务预测 ---")
    header = (f"{'年份':<5} | {'销售量':<12} | {'收入':<15} | {'销货成本(COGS)':<18} | "
              f"{'毛利润':<15} | {'营销费用':<12} | {'利润 (税前)':<15} | "
              f"{'年度现金流':<15} | {'累计现金流':<18}")
    print(header)
    print("-" * len(header))

    cumulative_cash_flow = -initial_investment
    # 第0年 (投资年)
    print(f"{'0':<5} | {'-':<12} | {'-':<15} | {'-':<18} | "
          f"{'-':<15} | {'-':<12} | {'-':<15} | "
          f"${-initial_investment:<14,.2f} | ${cumulative_cash_flow:<17,.2f}")

    for year in range(1, simulation_years + 1):
        if year > 1:
            current_sales_units *= (1 + annual_growth_rate_sales)
        
        # 四舍五入销售单位到整数，但保留浮点数进行中间计算
        actual_sales_units = round(current_sales_units)

        revenue = actual_sales_units * price_per_unit
        cogs = actual_sales_units * cost_per_unit
        gross_profit = revenue - cogs
        # 为简化起见，此处的利润为税前利润 (EBT)
        profit_before_tax = gross_profit - annual_marketing_expenses
        
        # 本年度现金流 (在运营年份中，简化为利润)
        yearly_cash_flow = profit_before_tax
        cash_flows.append(yearly_cash_flow)
        cumulative_cash_flow += yearly_cash_flow

        year_summary = {
            "year": year,
            "sales_units": int(actual_sales_units),
            "revenue": revenue,
            "cogs": cogs,
            "gross_profit": gross_profit,
            "marketing_expenses": annual_marketing_expenses,
            "profit": profit_before_tax,
            "cash_flow": yearly_cash_flow,
            "cumulative_cash_flow": cumulative_cash_flow
        }
        yearly_data.append(year_summary)

        print(f"{year:<5} | {int(actual_sales_units):<12,} | ${revenue:<14,.2f} | ${cogs:<17,.2f} | "
              f"${gross_profit:<14,.2f} | ${annual_marketing_expenses:<11,.2f} | ${profit_before_tax:<14,.2f} | "
              f"${yearly_cash_flow:<14,.2f} | ${cumulative_cash_flow:<17,.2f}")
    
    print("-" * len(header))
    print("\n--- 关键财务指标 ---")

    # 投资回收期 (Payback Period)
    payback_period_val = None
    current_cumulative_cf = 0.0
    for i in range(len(cash_flows)): # i=0 是初始投资, i=1 是第1年,以此类推
        prev_cumulative_cf = current_cumulative_cf
        current_cumulative_cf += cash_flows[i]

        if current_cumulative_cf >= 0 and prev_cumulative_cf < 0: # 在这一步从负数变为非负数
            if i == 0: # 在时间点0就收回 (不太可能，除非没有净投资)
                payback_period_val = 0.0
                break
            # 在运营年份 `i` 期间收回投资
            # 年份 `i` 的现金流是 `cash_flows[i]`
            # 年份 `i` 开始时的赤字是 `-prev_cumulative_cf`
            if cash_flows[i] == 0: 
                # 如果当年现金流为0，但累计已回正，说明在前一年年底正好回本
                # 但 prev_cumulative_cf < 0 条件下，cash_flows[i] 不可能为0 除非 prev_cumulative_cf 也为0
                # 此处假设 cash_flows[i] (回收年份的利润) > 0
                 payback_period_val = float(i) # 如果当年现金流为0，则精确在年末或年初
            else:
                payback_period_val = (i - 1) + (-prev_cumulative_cf / cash_flows[i])
            break 
    
    payback_period_str = ""
    if payback_period_val is not None:
        if payback_period_val == 0 and initial_investment > 0 and cash_flows[0] < 0:
             payback_period_str = "0.00 年 (立即或无净投资且首年盈利覆盖)" # 理论上，如果初始投资为负，则此情况不可能
        elif payback_period_val == 0 and initial_investment <=0 :
             payback_period_str = "0.00 年 (无初始投资或初始为正现金流)"
        elif payback_period_val is not None and payback_period_val.is_integer():
            payback_period_str = f"{int(payback_period_val):d} 年"
        else:
            payback_period_str = f"{payback_period_val:.2f} 年"
    else:
        payback_period_str = f"未能在 {simulation_years} 年内收回"
    
    print(f"投资回收期: {payback_period_str}")

    # 内部收益率 (IRR)
    irr_value = None
    try:
        irr_value = npf.irr(cash_flows)
        print(f"内部收益率 (IRR): {irr_value:.2%}")
    except Exception: # numpy_financial 在找不到IRR时可能抛出异常
        print(f"内部收益率 (IRR): 无法计算 (例如，所有现金流为负或无正现金流)")
        
    # 净现值 (NPV)
    npv_value = None
    try:
        npv_value = npf.npv(discount_rate, cash_flows)
        print(f"净现值 (NPV) @ {discount_rate:.2%}: ${npv_value:,.2f}")
    except Exception as e:
        print(f"净现值 (NPV): 无法计算 ({e})")
        
    print("---------------------------\n")

    print("--- 简要分析 ---")
    if npv_value is not None:
        if npv_value > 0:
            print(f"项目具有财务可行性，净现值为正，金额为 ${npv_value:,.2f}。")
        else:
            print(f"项目可能不具备财务可行性，净现值为负或零，金额为 ${npv_value:,.2f}。")
    else:
        print("无法计算NPV以进行进一步分析。")

    if irr_value is not None and discount_rate is not None:
        if irr_value > discount_rate:
            print(f"内部收益率 ({irr_value:.2%}) 高于折现率 ({discount_rate:.2%})，表明投资回报良好。")
        else:
            print(f"内部收益率 ({irr_value:.2%}) 未高于折现率 ({discount_rate:.2%})，表明投资回报可能未达到要求的最低标准。")
    elif irr_value is None:
         print("无法计算IRR以进行进一步分析。")

    if "未能在" in payback_period_str:
        print(f"初始投资{payback_period_str.lower()}，这可能是一个值得关注的问题，具体取决于公司的流动性偏好。")
    elif payback_period_val is not None :
        print(f"投资回收期约为 {payback_period_str}，这表明了收回初始投资所需的时间。")
        
    print("\n注意事项:")
    print("- 此模型为简化模型，未包含税收、明确的折旧（除非已隐含在单位成本中）或营运资本变动。")
    print("- 预测的准确性高度依赖于输入假设（增长率、成本、价格等）。")
    print("- 建议对关键变量进行敏感性分析，以获得更稳健的评估。")
    print("--------------------")

    return yearly_data, cash_flows, payback_period_str, irr_value, npv_value

# --- 示例用法 ---
if __name__ == "__main__":
    # 1. 定义输入变量:
    initial_investment_cost = 500000  # 初始投资成本
    initial_sales = 1000             # 预计年销量 (第一年)
    unit_price = 300                 # 单价
    unit_cost = 120                  # 生产成本 (单个)
    marketing_spend_annual = 75000   # 营销费用 (年度)
    growth_rate = 0.15               # 年度增长率 (15%) for sales units
    company_discount_rate = 0.10     # 公司折现率 (10%) for NPV

    print("=========== 场景 1: 乐观预测 ===========")
    financial_forecast(
        initial_investment=initial_investment_cost,
        initial_annual_sales_units=initial_sales,
        price_per_unit=unit_price,
        cost_per_unit=unit_cost,
        annual_marketing_expenses=marketing_spend_annual,
        annual_growth_rate_sales=growth_rate,
        discount_rate=company_discount_rate
    )

    print("\n=========== 场景 2: 保守预测 ===========")
    initial_investment_cost_2 = 600000
    initial_sales_2 = 800
    unit_price_2 = 280
    unit_cost_2 = 150 # 单位成本更高
    marketing_spend_annual_2 = 90000 # 营销费用更高
    growth_rate_2 = 0.05 # 增长率更低
    company_discount_rate_2 = 0.12 # 折现率更高

    financial_forecast(
        initial_investment=initial_investment_cost_2,
        initial_annual_sales_units=initial_sales_2,
        price_per_unit=unit_price_2,
        cost_per_unit=unit_cost_2,
        annual_marketing_expenses=marketing_spend_annual_2,
        annual_growth_rate_sales=growth_rate_2,
        discount_rate=company_discount_rate_2
    )

    print("\n=========== 场景 3: 快速回收但增长有限 ===========")
    financial_forecast(
        initial_investment=200000,
        initial_annual_sales_units=1500,
        price_per_unit=100,
        cost_per_unit=40, # 较低的单位成本，较高的毛利
        annual_marketing_expenses=30000,
        annual_growth_rate_sales=0.02, # 增长非常缓慢
        discount_rate=0.08
    )
