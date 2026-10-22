const packageData = {
    wedding: [
        { value: "classic", label: "باقة ليلة العمر", price: 2500 },
        { value: "premium", label: "باقة ليلة العمر المميزة", price: 4000 },
        { value: "custom", label: "باقة خاصة", price: null }
    ],

    birthday: [
        { value: "classic", label: "باقة عيد الميلاد", price: 500 },
        { value: "premium", label: "باقة عيد الميلاد بلس", price: 900 },
        { value: "custom", label: "باقة خاصة", price: null }
    ],

    graduation: [
        { value: "classic", label: "باقة التخرج", price: 700 },
        { value: "premium", label: "باقة التخرج المميزة", price: 1200 },
        { value: "custom", label: "باقة خاصة", price: null }
    ]
};

const eventSelect = document.querySelector("#event");
const packageSelect = document.querySelector("#package");
const priceInfo = document.querySelector("#price");
const form = document.querySelector("#bookingForm");
const message = document.querySelector("#message");
const dateInput = document.querySelector("#date");

// منع اختيار تاريخ سابق
if (dateInput) {
    const today = new Date();
    const localDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 10);

    dateInput.min = localDate;
}

// تحديث الباقات حسب المناسبة المختارة
function updatePackages() {
    if (!eventSelect || !packageSelect) return;

    const selectedEvent = eventSelect.value;
    const choices = packageData[selectedEvent] || [];

    packageSelect.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = choices.length
        ? "اختاري الباقة"
        : "اختاري المناسبة أولاً";

    packageSelect.appendChild(placeholder);

    choices.forEach(item => {
        const option = document.createElement("option");

        option.value = item.value;
        option.textContent = item.label;

        packageSelect.appendChild(option);
    });

    packageSelect.disabled = choices.length === 0;

    if (priceInfo) {
        priceInfo.textContent =
            "السعر المبدئي يظهر بعد اختيار الباقة.";
    }
}

// عرض السعر بعد اختيار الباقة
function updatePrice() {
    if (!eventSelect || !packageSelect || !priceInfo) return;

    const selectedEvent = eventSelect.value;
    const selectedPackage = packageSelect.value;

    const selected = (packageData[selectedEvent] || []).find(
        item => item.value === selectedPackage
    );

    if (!selected) {
        priceInfo.textContent =
            "السعر المبدئي يظهر بعد اختيار الباقة.";
        return;
    }

    if (selected.price === null) {
        priceInfo.textContent =
            "السعر يحدد حسب تفاصيل مناسبتك.";
        return;
    }

    priceInfo.textContent =
        `السعر المبدئي: ${selected.price.toLocaleString("ar-LY")} د.ل`;
}

// تجهيز قائمة الباقات عند فتح صفحة الحجز
if (eventSelect && packageSelect) {
    eventSelect.addEventListener("change", updatePackages);
    packageSelect.addEventListener("change", updatePrice);

    // استقبال المناسبة إذا تم اختيارها من صفحة الباقات
    const requestedEvent =
        new URLSearchParams(window.location.search).get("event");

    if (requestedEvent && packageData[requestedEvent]) {
        eventSelect.value = requestedEvent;
    }

    updatePackages();
}

// التحقق من بيانات نموذج الحجز
if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const data = new FormData(form);

        const name = data.get("name");
        const selectedEvent = data.get("event");
        const selectedPackage = data.get("package");

        const eventNames = {
            wedding: "ليلة العمر",
            birthday: "عيد الميلاد",
            graduation: "التخرج"
        };

        const selected = (packageData[selectedEvent] || []).find(
            item => item.value === selectedPackage
        );

        // التأكد من اختيار مناسبة وباقة صحيحتين
        if (!eventNames[selectedEvent] || !selected) {
            if (message) {
                message.textContent =
                    "يرجى اختيار المناسبة والباقة قبل إرسال الطلب.";
                message.classList.add("success-message");
            }

            return;
        }

        // عرض رسالة تأكيد تجريبية
        if (message) {
            message.textContent =
                `أهلاً بيك يا ${name} ✨ ` +
                `تم التحقق من طلبك التجريبي لمناسبة ` +
                `${eventNames[selectedEvent]}، ` +
                `واختيارك هو ${selected.label}. ` +
                `سيتم التواصل معك لتأكيد التفاصيل. ` +
                `ملاحظة: لم يتم حفظ البيانات أو إرسالها فعلياً.`;

            message.classList.add("success-message");

            message.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    });
}