function inRange(date, startDate, endDate) {
  const value = new Date(date).getTime();
  if (startDate && value < new Date(startDate).getTime()) {
    return false;
  }
  if (endDate && value > new Date(endDate).getTime()) {
    return false;
  }
  return true;
}

export function buildDashboardRows({ purchases, transfers, assignments, expenditures, baseId, equipmentId, startDate, endDate }) {
  const filteredPurchases = purchases.filter((item) => {
    if (baseId && item.baseId !== Number(baseId)) return false;
    if (equipmentId && item.equipmentId !== Number(equipmentId)) return false;
    return inRange(item.date, startDate, endDate);
  });

  const filteredTransfers = transfers.filter((item) => {
    if (equipmentId && item.equipmentId !== Number(equipmentId)) return false;
    return inRange(item.date, startDate, endDate);
  });

  const filteredAssignments = assignments.filter((item) => {
    if (baseId && item.baseId !== Number(baseId)) return false;
    if (equipmentId && item.equipmentId !== Number(equipmentId)) return false;
    return inRange(item.date, startDate, endDate);
  });

  const filteredExpenditures = expenditures.filter((item) => {
    if (baseId && item.baseId !== Number(baseId)) return false;
    if (equipmentId && item.equipmentId !== Number(equipmentId)) return false;
    return inRange(item.date, startDate, endDate);
  });

  const openingBalance = 0;
  const purchasesTotal = filteredPurchases.reduce((sum, item) => sum + item.quantity, 0);
  const transferInTotal = filteredTransfers.filter((item) => !baseId || item.toBaseId === Number(baseId)).reduce((sum, item) => sum + item.quantity, 0);
  const transferOutTotal = filteredTransfers.filter((item) => !baseId || item.fromBaseId === Number(baseId)).reduce((sum, item) => sum + item.quantity, 0);
  const assignedAssets = filteredAssignments.reduce((sum, item) => sum + item.quantity, 0);
  const expendedAssets = filteredExpenditures.reduce((sum, item) => sum + item.quantity, 0);
  const netMovement = purchasesTotal + transferInTotal - transferOutTotal;
  const closingBalance = openingBalance + netMovement - assignedAssets - expendedAssets;

  return {
    openingBalance,
    closingBalance,
    purchasesTotal,
    transferInTotal,
    transferOutTotal,
    assignedAssets,
    expendedAssets,
    netMovement,
    filteredPurchases,
    filteredTransfers,
    filteredAssignments,
    filteredExpenditures,
  };
}
