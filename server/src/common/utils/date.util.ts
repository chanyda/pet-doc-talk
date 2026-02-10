/**
 * 생년월일을 기준으로 사용자 친화적인 나이 표시를 반환합니다.
 * - 1세 미만: "N개월"
 * - 1세 이상: "N세"
 * - null인 경우: "알 수 없음"
 * @param birthDate 생년월일 (nullable)
 * @returns 나이 표시 문자열
 */
export function getAgeDisplay(birthDate: Date): string {
    const age = calculateAge(birthDate);

    if (age < 1) {
        const months = calculateAgeInMonths(birthDate);
        return `${months}개월`;
    }

    return `${age}살`;
}

/**
 * 생년월일을 기준으로 만 나이를 계산
 * @param birthDate 생년월일
 * @returns 만 나이 (년)
 */
export function calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // 생일이 아직 지나지 않았으면 나이를 1 줄임
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

/**
 * 생년월일을 기준으로 개월 수를 계산
 * @param birthDate 생년월일
 * @returns 개월 수
 */
export function calculateAgeInMonths(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);

    let months = (today.getFullYear() - birth.getFullYear()) * 12;
    months += today.getMonth() - birth.getMonth();

    // 일자가 아직 지나지 않았으면 개월을 1 줄임
    if (today.getDate() < birth.getDate()) {
        months--;
    }

    return Math.max(0, months); // 음수 방지
}

/**
 * 두 날짜 사이의 일수를 계산
 * @param startDate 시작 날짜
 * @param endDate 종료 날짜 (기본값: 오늘)
 * @returns 일수
 */
export function calculateDaysBetween(startDate: Date, endDate: Date = new Date()): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}
