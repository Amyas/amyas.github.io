package com.amyas.sort;

import java.text.DecimalFormat;

import com.amyas.Student;

@SuppressWarnings("unchecked")
public abstract class Sort<E extends Comparable<E>> implements Comparable<Sort<E>> {
  protected E[] array;
  private int cmpCount;
  private int swapCount;
  private long time;
  private DecimalFormat fmt = new DecimalFormat("#.00");

  public void sort(E[] array) {
    if (array == null || array.length < 2) {
      return;
    }
    this.array = array;

    long begin = System.currentTimeMillis();
    sort();
    time = System.currentTimeMillis() - begin;
  }

  @Override
  public int compareTo(Sort<E> o) {
    int result = (int) (time - o.time);
    if (result != 0) {
      return result;
    }

    result = cmpCount - o.cmpCount;
    if (result != 0) {
      return result;
    }

    return swapCount - o.swapCount;
  }

  protected abstract void sort();

  // 返回值等于0，代表 i1 = i2
  // 返回值大于0，代表 i1 > i2
  // 返回值小于0，代表 i1 < i2
  protected int cmp(int i1, int i2) {
    cmpCount++;
    return array[i1].compareTo(array[i2]);
  }

  protected int cmp(E v1, E v2) {
    cmpCount++;
    return v1.compareTo(v2);
  }

  protected void swap(int i1, int i2) {
    swapCount++;
    E tmp = array[i1];
    array[i1] = array[i2];
    array[i2] = tmp;
  }

  @Override
  public String toString() {
    String timeStr = "耗时：" + (time / 1000.0) + "s(" + time + "ms)";
    String compareCountStr = "比较：" + numberString(cmpCount);
    String swapCountStr = "交换：" + numberString(swapCount);
    String stableString = "稳定性：" + isStable() + " ";
    return "【" + getClass().getSimpleName() + "】\n"
        + stableString + " \t"
        + timeStr + " \t"
        + compareCountStr + "\t "
        + swapCountStr + "\n"
        + "------------------------------------------------------------------";

  }

  private boolean isStable() {
    if (this instanceof CountingSort)
      return false;
    if (this instanceof ShellSort)
      return false;
    Student[] students = new Student[20];
    for (int i = 0; i < students.length; i++) {
      students[i] = new Student(i * 10, 10);
    }
    sort((E[]) students);

    for (int i = 1; i < students.length; i++) {
      int score = students[i].score;
      int prevScore = students[i - 1].score;
      if (score != prevScore + 10) {
        return false;
      }
    }
    return true;
  }

  private String numberString(int number) {
    if (number < 10000)
      return "" + number;

    if (number < 100000000)
      return fmt.format(number / 10000.0) + "万";
    return fmt.format(number / 100000000.0) + "亿";
  }

}
