export interface Question {
    id: string;
    text: string;
    points: number;
    isSteal?: boolean;
    isDouble?: boolean;
    isAnswered: boolean;
}

export interface Category {
    points: number;
    questions: Question[];
}

const generateQuestions = (points: number, count: number): Question[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `q-${points}-${i}`,
        text: `سؤال تجريبي بقيمة ${points} نقطة رقم ${i + 1}`,
        points: points,
        isAnswered: false,
    }));
};

export const INITIAL_CATEGORIES: Category[] = [
    {
        points: 5,
        questions: [
            { id: 'q-5-0', text: 'من النبي الذي قام بتجميع الكتب ؟', points: 5, isAnswered: false },
            { id: 'q-5-1', text: 'ما اسم ابن سليمان النبي ؟', points: 5, isAnswered: false },
            { id: 'q-5-2', text: 'ما الدور الذي قام به نحميا بعد الرجوع من السبي ؟', points: 5, isAnswered: false },
            { id: 'q-5-3', text: 'كم عدد أسفار الكتاب المقدس عند الارثوذكس ؟', points: 5, isAnswered: false },
        ]
    },
    {
        points: 10,
        questions: [
            { id: 'q-10-0', text: 'من الذي قام بإعادة بناء الهيكل بعد الرجوع من السبي؟', points: 10, isAnswered: false },
            { id: 'q-10-1', text: 'عدد اسباط المملكة الشمالية؟', points: 10, isAnswered: false },
            { id: 'q-10-2', text: 'اسم رئيس الكهنة الذي تمت في عهده الترجمة السبعينية؟', points: 10, isAnswered: false },
            { id: 'q-10-3', text: 'ما هي الجزيرة التي تمت عليها الترجمة ؟', points: 10, isAnswered: false },
        ]
    },
    {
        points: 20,
        questions: [
            { id: 'q-20-0', text: 'اسماء السبطين في المملكة الجنوبية ؟', points: 20, isAnswered: false },
            { id: 'q-20-1', text: 'مجمع جامنيا تم سنة كام ؟', points: 20, isAnswered: false },
            { id: 'q-20-2', text: 'صاحب ترجمة الكتاب المقدس؟', points: 20, isAnswered: false },
            { id: 'q-20-3', text: 'الشيوخ اللي قاموا بالترجمة السبعينية اتقسموا على كام فريق ؟', points: 20, isAnswered: false },
        ]
    },
    {
        points: 40,
        questions: [
            { id: 'q-40-0', text: 'في اي عام تم العثور على مخطوطات وادي قمران؟', points: 40, isAnswered: false },
            { id: 'q-40-1', text: 'اذكر احد الأسفار التي لم يقتبس منها العهد الجديد؟', points: 40, isAnswered: false },
            { id: 'q-40-2', text: 'عاصمة المملكة الشمالية؟', points: 40, isAnswered: false },
            { id: 'q-40-3', text: 'في اي عام حدث سبي المملكة الشمالية؟', points: 40, isAnswered: false },
        ]
    },
];

// Inject Special Cards
// Steal in 10
const cat10 = INITIAL_CATEGORIES.find(c => c.points === 10);
if (cat10) {
    const randIdx = Math.floor(Math.random() * cat10.questions.length);
    cat10.questions[randIdx].isSteal = true;
}

// Double in 20
const cat20 = INITIAL_CATEGORIES.find(c => c.points === 20);
if (cat20) {
    const randIdx = Math.floor(Math.random() * cat20.questions.length);
    cat20.questions[randIdx].isDouble = true;
}
